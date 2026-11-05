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
                assert page.evaluate('window.__efmEvents.length') == 0, 'Initial defaults are not user actions'
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
            exercise_motion(browser, results)
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
    exercise_finder(page)
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
    assert all(event['event'] in ['language_select', 'plan_select', 'rhythm_select', 'whatsapp_click'] for event in payloads)
    assert page.locator('body').inner_text().find('Passagem aérea não incluída') >= 0
    assert not re.search(r'\b(?:[3-9]0|[1-9]\d{2}) minutos\b', page.locator('body').inner_text())


def assert_finder_selection(page, language, plan):
    """One source of selection must drive the finder, cards, status and links."""
    expect(page.locator('[data-rhythm][aria-pressed="true"]')).to_have_count(1)
    expect(page.locator(f'[data-rhythm="{plan["id"]}"]')).to_have_attribute('aria-pressed', 'true')
    expect(page.locator(f'[data-select-plan="{plan["id"]}"]')).to_have_attribute('aria-pressed', 'true')
    expect(page.locator('[data-choice-title]')).to_have_text(f'{language["label"]} · {plan["name"]}')
    expect(page.locator('[data-choice-description]')).to_contain_text(f'{plan["classesPerMonth"]} aulas online por mês')
    expect(page.locator('[data-choice-price]')).to_contain_text(f'{plan["monthlyPriceBRL"]},00')
    expect(page.locator('[data-choice-chances]')).to_have_text(f'{plan["drawChances"]} chances no sorteio')
    expect(page.locator('#selection-status')).to_contain_text(language['label'])
    expect(page.locator('#selection-status')).to_contain_text(plan['name'])
    expect(page.locator('#selection-status')).to_contain_text(f'{plan["classesPerMonth"]} aulas por mês')
    expect(page.locator('#selection-status')).to_have_attribute('aria-live', 'polite')
    expect(page.locator('#selected-plan')).to_contain_text('R$ 199,90')
    expect(page.locator('#selected-plan')).to_contain_text('Primeira mensalidade em dezembro')
    expect(page.locator('#selected-plan')).to_contain_text('1 mês do outro idioma')
    expect(page.locator('#selected-plan')).to_contain_text('Passagem aérea não incluída')
    expect(page.locator('[data-selection-cta] span')).to_have_text(f'Continuar com o {plan["name"]}')
    for link in page.locator('[data-whatsapp]:not([data-plan])').all():
        check_link(link, language, plan)
    for summary in page.locator('[data-current-selection]').all():
        expect(summary).to_contain_text(language['label'])
        expect(summary).to_contain_text(plan['name'])


def exercise_finder(page):
    # The preceding checks finish on English/Premium. Choose each monthly rhythm,
    # then switch language in both directions without changing its category.
    for plan in CAMPAIGN['modalities'][0]['plans']:
        before = page.evaluate('window.__efmEvents.length')
        rhythm = page.locator(f'[data-rhythm="{plan["id"]}"]')
        rhythm.focus()
        page.keyboard.press('Enter')
        assert rhythm.evaluate('(e)=>e===document.activeElement'), 'Finder choice loses keyboard focus'
        assert page.evaluate('window.__efmEvents.length') == before + 1
        assert page.evaluate('window.__efmEvents.at(-1)') == {
            'event': 'rhythm_select', 'section': 'plan-finder',
            'language': 'english', 'plan': plan['id'],
        }
        assert_finder_selection(page, CAMPAIGN['modalities'][0], plan)
        # Repeating the selected rhythm/card/language must not fabricate actions.
        before = page.evaluate('window.__efmEvents.length')
        page.keyboard.press('Space')
        page.locator(f'[data-select-plan="{plan["id"]}"]').click()
        page.locator('[data-language="english"]').click()
        assert page.evaluate('window.__efmEvents.length') == before
        for language in CAMPAIGN['modalities'][::-1]:
            before = page.evaluate('window.__efmEvents.length')
            page.locator(f'[data-language="{language["id"]}"]').click()
            assert page.evaluate('window.__efmEvents.length') == before + 1
            matching = next(p for p in language['plans'] if p['id'] == plan['id'])
            assert_finder_selection(page, language, matching)
        before = page.evaluate('window.__efmEvents.length')
        page.locator('[data-selection-cta]').click()
        assert page.evaluate('window.__efmEvents.length') == before + 1
        assert page.evaluate('window.__efmEvents.at(-1)') == {
            'event': 'whatsapp_click', 'section': 'selected-plan',
            'language': 'english', 'plan': plan['id'],
        }


def assert_content_available(page):
    # These are intentionally readable even before an observer fires, or when
    # IntersectionObserver is absent. Collapsed FAQ answers are not in scope.
    selectors = ['h1', '.hero-actions', '.plan-finder', '.plan-card',
                 '.malta-copy', '.bonus-details', '.faq-list', '.final-section']
    for selector in selectors:
        for node in page.locator(selector).all():
            expect(node).to_be_visible()
            assert node.evaluate("""e => {
                for (let n=e; n; n=n.parentElement) {
                    const s=getComputedStyle(n);
                    if (s.display==='none' || s.visibility!=='visible' || Number(s.opacity)<=0) return false;
                }
                return true;
            }"""), f'Content depends on motion to be readable: {selector}'


def assert_reduced_motion(page):
    expect(page.locator('html')).to_have_class(re.compile('efm-motion-reduced'))
    assert page.evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches")
    assert page.evaluate("document.getAnimations().filter(a=>a.playState==='running' || a.pending).length") == 0
    assert page.locator('.hero-art').evaluate("e=>!e.style.getPropertyValue('--motion-x') && !e.style.getPropertyValue('--motion-y')")
    assert_content_available(page)


def exercise_motion(browser, results):
    """Additional desktop motion scenarios; never send a WhatsApp message."""
    for without_observer in [False, True]:
        context = browser.new_context(viewport={'width': 1440, 'height': 900}, reduced_motion='no-preference')
        external, errors = [], []
        context.route('**/*', lambda route: route.continue_() if urlparse(route.request.url).hostname in ['127.0.0.1', 'localhost'] else (external.append(route.request.url), route.abort())[-1])
        if without_observer:
            context.add_init_script('delete window.IntersectionObserver;')
        page = context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        try:
            page.goto(BASE)
            page.get_by_role('heading', level=1).wait_for(state='visible')
            expect(page.locator('html')).to_have_class(re.compile('efm-motion'))
            assert not page.evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches")
            assert_content_available(page)
            assert page.locator('.motion-route').count() == 1
            assert page.locator('.hero h1').evaluate("e=>getComputedStyle(e).animationName") == 'efm-rise'
            # The campaign tape is intentionally continuous. No other decorative
            # animation may loop forever, and reduced-motion still disables it.
            assert page.evaluate("""document.getAnimations()
                .filter(a=>a.effect.getTiming().iterations === Infinity)
                .every(a=>getComputedStyle(a.effect.target).animationName === 'efm-marquee')"""), 'Only the campaign tape may loop'
            if without_observer:
                assert not page.evaluate("'IntersectionObserver' in window")
                # Full decision flow remains available with no observer API.
                page.locator('[data-rhythm="premium"]').click()
                assert_finder_selection(page, CAMPAIGN['modalities'][0], CAMPAIGN['modalities'][0]['plans'][2])
            else:
                # Normal pointer feedback, then immediate runtime preference switch.
                page.locator('.hero-art').scroll_into_view_if_needed()
                expect(page.locator('.hero-art')).to_have_class(re.compile('motion-scene-visible'))
                page.locator('.hero-art').dispatch_event('pointermove', {'clientX': 1000, 'clientY': 450})
                page.wait_for_function("document.querySelector('.hero-art').style.getPropertyValue('--motion-x') !== ''")
                # Start a WAAPI feedback animation before switching the preference.
                page.evaluate("document.querySelector('[data-rhythm=pro]').click()")
            # Extend this test's in-flight feedback only, avoiding a race with its
            # production 260 ms duration while emulating an OS setting change.
            assert page.evaluate("""() => {
                const animations=document.querySelector('.selected-plan').getAnimations();
                animations.forEach(a=>a.effect.updateTiming({duration:10000}));
                return animations.length > 0;
            }"""), 'Normal selection should supply finite motion feedback'
            page.emulate_media(reduced_motion='reduce')
            assert_reduced_motion(page)
            page.locator('[data-rhythm="basic"]').click()
            assert_reduced_motion(page)
            page.emulate_media(reduced_motion='no-preference')
            expect(page.locator('html')).not_to_have_class(re.compile('efm-motion-reduced'))
            assert_content_available(page)
            page.locator('[data-rhythm="premium"]').click()
            assert_finder_selection(page, CAMPAIGN['modalities'][0], CAMPAIGN['modalities'][0]['plans'][2])
            assert not errors, errors
            assert not external, external
            results.append({'scenario': 'motion-without-observer' if without_observer else 'motion-runtime-preference', 'status': 'passed'})
        finally:
            context.close()



if __name__ == '__main__':
    run()
