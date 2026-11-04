"""Functional and responsive smoke checks. Run against npm run dev (localhost only)."""
import json
import os
import re
import shutil
from pathlib import Path
from urllib.parse import parse_qs, urlparse
from playwright.sync_api import sync_playwright, expect

BASE = os.environ.get('EFM_TEST_URL', 'http://127.0.0.1:5173')
ARTIFACTS = Path('/tmp/efm-black-friday-review')
ROOT = Path(__file__).resolve().parents[1]
CAMPAIGN = json.loads((ROOT / 'config/campaign.json').read_text())


def check_link(link, language, plan):
    url = urlparse(link.get_attribute('href'))
    assert url.scheme == 'https' and url.netloc == 'wa.me'
    assert url.path == '/' + CAMPAIGN['whatsapp']['phone']
    message = parse_qs(url.query)['text'][0]
    assert language['label'] in message, message
    assert plan['name'] in message, message
    if not link.get_attribute('data-referral'):
        assert str(plan['classesPerMonth']) in message, message
    assert link.get_attribute('target') == '_blank'
    assert 'noopener' in (link.get_attribute('rel') or '')


def run():
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or p.chromium.executable_path, args=['--no-sandbox'])
        try:
            for width in [375, 390, 768, 1440]:
                context = browser.new_context(viewport={'width': width, 'height': 900}, reduced_motion='reduce')
                external = []
                context.route('**/*', lambda route: route.continue_() if urlparse(route.request.url).hostname in ['127.0.0.1', 'localhost'] else (external.append(route.request.url), route.abort())[-1])
                page = context.new_page()
                errors = []
                page.on('pageerror', lambda error: errors.append(str(error)))
                page.add_init_script("window.__efmEvents=[];window.dataLayer=[];window.addEventListener('efm:analytics',e=>window.__efmEvents.push(e.detail));")
                page.goto(BASE)
                page.get_by_role('main').wait_for(state='visible')
                page.get_by_role('heading', level=1).wait_for(state='visible')
                page.evaluate('document.fonts.ready')
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'overflow {width}'
                assert page.locator('h1').count() == 1
                assert page.locator('img:not([alt])').count() == 0
                assert page.locator('a[href="#"]').count() == 0
                assert page.evaluate("[...document.querySelectorAll('img')].filter(e=>e.loading!=='lazy').every(e=>e.complete && e.naturalWidth>0)")
                assert page.evaluate("getComputedStyle(document.body).fontFamily.includes('Montserrat')")
                assert page.evaluate("document.fonts.check('16px Montserrat')")
                # Remaining selectors are verified against the implementation before release.
                exercise(page)
                for image in page.locator('img').all():
                    image.scroll_into_view_if_needed()
                    expect(image).to_have_js_property('complete', True)
                    assert image.evaluate('(e)=>e.naturalWidth>0')
                page.evaluate('scrollTo(0,document.body.scrollHeight)')
                if width < 601:
                    footer_bottom = page.locator('.footer-note').bounding_box()
                    sticky_top = page.locator('.mobile-sticky').bounding_box()['y']
                    assert footer_bottom['y'] + footer_bottom['height'] <= sticky_top, 'Sticky covers footer text'
                page.evaluate('document.activeElement.blur();scrollTo(0,0)')
                page.screenshot(path=str(ARTIFACTS / f'page-{width}.png'), full_page=True)
                page.evaluate('scrollTo(0,0)')
                page.screenshot(path=str(ARTIFACTS / f'hero-{width}.png'))
                assert not errors, errors
                assert not external, f'Unexpected third-party requests: {external}'
                assert page.evaluate('window.dataLayer.length') == 0, 'Consent default must deny provider events'
                active_motion = page.evaluate("[...document.querySelectorAll('*')].filter(e=>{let s=getComputedStyle(e);return s.animationName!=='none' && parseFloat(s.animationDuration)>0.01}).map(e=>e.className)")
                assert not active_motion, active_motion
                results.append({'viewport': width, 'status': 'passed', 'page_errors': errors, 'external_requests': external})
                context.close()
        finally:
            browser.close()
    (ARTIFACTS / 'results.json').write_text(json.dumps(results, indent=2))
    print(json.dumps(results, indent=2))


def exercise(page):
    page.evaluate("document.addEventListener('click',e=>{if(e.target.closest('[data-whatsapp]'))e.preventDefault()})")
    page.locator('[data-select-plan="premium"]').click()
    expect(page.locator('[data-plan-card="premium"]')).to_have_class(re.compile('is-selected'))
    for language in CAMPAIGN['modalities'][::-1]:
        before = page.evaluate('window.__efmEvents.length')
        page.locator(f'[data-language="{language["id"]}"]').click()
        expect(page.locator(f'[data-language="{language["id"]}"]')).to_have_attribute('aria-pressed', 'true')
        expect(page.locator('[data-select-plan="premium"]')).to_have_attribute('aria-pressed', 'true')
        assert page.evaluate('window.__efmEvents.length') == before + 1
        assert page.evaluate('window.__efmEvents.at(-1).event') == 'language_select'
        for plan in language['plans']:
            card = page.locator(f'[data-plan-card="{plan["id"]}"]')
            expect(card.get_by_role('heading', level=3)).to_have_text(plan['name'])
            expect(card.locator('.class-count strong')).to_have_text(str(plan['classesPerMonth']))
            expect(card.locator('.plan-price')).to_contain_text(str(plan['monthlyPriceBRL']))
            expect(card).to_contain_text(f'{plan["drawChances"]} chances no sorteio')
            check_link(card.locator('[data-whatsapp]'), language, plan)
            before = page.evaluate('window.__efmEvents.length')
            card.locator('[data-select-plan]').click()
            assert page.evaluate('window.__efmEvents.length') == before + 1
            expect(page.locator(f'[data-select-plan="{plan["id"]}"]')).to_have_attribute('aria-pressed', 'true')
            for link in page.locator('[data-whatsapp]:not([data-plan])').all():
                check_link(link, language, plan)
        # Card WhatsApp also updates global selection, emitting intent once.
        before = page.evaluate('window.__efmEvents.length')
        page.locator('[data-plan-card="pro"] [data-whatsapp]').click()
        assert page.evaluate('window.__efmEvents.length') == before + 1
        assert page.evaluate('window.__efmEvents.at(-1).event') == 'whatsapp_click'
        expect(page.locator('[data-select-plan="pro"]')).to_have_attribute('aria-pressed', 'true')
        # Restore premium so language switching must preserve that category.
        page.locator('[data-select-plan="premium"]').click()
    summary = page.locator('summary').first
    summary.focus()
    assert summary.evaluate('(e)=>e===document.activeElement')
    page.keyboard.press('Enter')
    assert page.locator('details').first.get_attribute('open') is not None
    page.keyboard.press('Space')
    assert page.locator('details').first.get_attribute('open') is None
    focus_style = summary.evaluate('(e)=>({outline:getComputedStyle(e).outlineStyle,width:getComputedStyle(e).outlineWidth})')
    assert focus_style['outline'] != 'none' and focus_style['width'] != '0px'
    page.keyboard.press('Tab')
    assert page.evaluate('document.activeElement.tagName') != 'BODY'
    payloads = page.evaluate('window.__efmEvents')
    assert all(set(event) == {'event', 'section', 'language', 'plan'} for event in payloads)
    assert all(event['event'] in ['language_select', 'plan_select', 'whatsapp_click'] for event in payloads)
    assert page.locator('body').inner_text().find('Passagem aérea não incluída') >= 0
    assert not re.search(r'\b(?:[3-9]0|[1-9]\d{2}) minutos\b', page.locator('body').inner_text())



if __name__ == '__main__':
    run()
