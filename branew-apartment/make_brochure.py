"""
BRANEW Premium Apartment — 3-page text-only brochure PDF
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, KeepTogether,
)

# ---- 한글 폰트 등록 (Windows Malgun Gothic) ----
pdfmetrics.registerFont(TTFont('Malgun', 'C:/Windows/Fonts/malgun.ttf'))
pdfmetrics.registerFont(TTFont('MalgunBd', 'C:/Windows/Fonts/malgunbd.ttf'))

# ---- 색상 ----
INK = HexColor('#0e0e0e')
GOLD = HexColor('#c19a5b')
GRAY_DARK = HexColor('#3a3a3a')
GRAY = HexColor('#6a6a6a')
GRAY_LIGHT = HexColor('#cfcfcf')
PAPER = HexColor('#f6f4ef')

# ---- 스타일 ----
styles = {
    'eyebrow': ParagraphStyle(
        'eyebrow', fontName='Malgun', fontSize=8, leading=12,
        textColor=GOLD, spaceAfter=10,
    ),
    'title_xl': ParagraphStyle(
        'title_xl', fontName='MalgunBd', fontSize=36, leading=44,
        textColor=INK, spaceAfter=18,
    ),
    'title_l': ParagraphStyle(
        'title_l', fontName='MalgunBd', fontSize=24, leading=32,
        textColor=INK, spaceAfter=14,
    ),
    'title_m': ParagraphStyle(
        'title_m', fontName='MalgunBd', fontSize=16, leading=22,
        textColor=INK, spaceAfter=10,
    ),
    'h_section': ParagraphStyle(
        'h_section', fontName='MalgunBd', fontSize=10, leading=14,
        textColor=GOLD, spaceAfter=6, letterSpacing=2,
    ),
    'lead': ParagraphStyle(
        'lead', fontName='Malgun', fontSize=11, leading=18,
        textColor=GRAY_DARK, spaceAfter=14,
    ),
    'body': ParagraphStyle(
        'body', fontName='Malgun', fontSize=10, leading=16,
        textColor=GRAY_DARK, spaceAfter=8,
    ),
    'small': ParagraphStyle(
        'small', fontName='Malgun', fontSize=8, leading=12,
        textColor=GRAY, spaceAfter=4,
    ),
    'gold_value': ParagraphStyle(
        'gold_value', fontName='MalgunBd', fontSize=11, leading=16,
        textColor=GOLD, spaceAfter=4,
    ),
    'center': ParagraphStyle(
        'center', fontName='Malgun', fontSize=10, leading=16,
        textColor=GRAY_DARK, alignment=TA_CENTER, spaceAfter=8,
    ),
    'tagline': ParagraphStyle(
        'tagline', fontName='Malgun', fontSize=10, leading=14,
        textColor=GOLD, alignment=TA_CENTER, spaceAfter=20, letterSpacing=4,
    ),
}


def divider(width_mm=170):
    """가는 골드 가로선 (Table을 0높이로 활용)."""
    t = Table([['']], colWidths=[width_mm * mm], rowHeights=[0.5])
    t.setStyle(TableStyle([
        ('LINEBELOW', (0, 0), (-1, -1), 0.6, GOLD),
    ]))
    return t


def kv_table(rows, label_col_w=32, value_col_w=130):
    """라벨–값 형태의 정보 테이블."""
    data = []
    for label, value in rows:
        data.append([
            Paragraph(label, styles['h_section']),
            Paragraph(value, styles['body']),
        ])
    t = Table(data, colWidths=[label_col_w * mm, value_col_w * mm])
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LINEBELOW', (0, 0), (-1, -1), 0.3, GRAY_LIGHT),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    return t


def unit_row(name, share, area_use, area_supply, area_contract, points):
    """한 줄짜리 컴팩트 평형 라인 — 이름 / 면적 / 특징을 한 행에."""
    cells = [
        Paragraph(f'<font name="MalgunBd" size="20" color="#0e0e0e">{name}</font>', styles['body']),
        Paragraph(
            f'<font color="#c19a5b">전용</font> {area_use}<br/>'
            f'<font color="#c19a5b">공급</font> {area_supply}<br/>'
            f'<font color="#c19a5b">계약</font> {area_contract}',
            ParagraphStyle('m', fontName='Malgun', fontSize=9, leading=13, textColor=GRAY_DARK),
        ),
        Paragraph(
            '<br/>'.join(f'— {p}' for p in points) +
            f'<br/><font color="#888">{share}</font>',
            ParagraphStyle('p', fontName='Malgun', fontSize=9, leading=13, textColor=GRAY_DARK),
        ),
    ]
    t = Table([cells], colWidths=[26 * mm, 48 * mm, 88 * mm])
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LINEBELOW', (0, 0), (-1, -1), 0.3, GRAY_LIGHT),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    return t


# ---- 문서 정의 ----
doc = SimpleDocTemplate(
    'branew-brochure.pdf',
    pagesize=A4,
    leftMargin=22 * mm,
    rightMargin=22 * mm,
    topMargin=20 * mm,
    bottomMargin=20 * mm,
    title='BRANEW Premium Apartment',
    author='branduoy-lab',
)

story = []

# ============================================================
# PAGE 1 — Brand & Concept
# ============================================================
story.append(Paragraph('BRANEW · 브래뉴', styles['eyebrow']))
story.append(Paragraph('A NEW STANDARD<br/>OF LIVING.', styles['title_xl']))
story.append(divider())
story.append(Spacer(1, 14))

story.append(Paragraph(
    '도시 위에 완성되는 단 하나의 기준.<br/>'
    '브래뉴가 제안하는 프리미엄 라이프의 시작.',
    styles['lead']
))
story.append(Spacer(1, 8))

story.append(Paragraph('01 — BRAND VALUE', styles['h_section']))
story.append(Paragraph('자연과 함께하는 일상의 품격.', styles['title_m']))
story.append(Paragraph(
    '브래뉴는 단순히 머무는 공간을 만들지 않습니다.<br/>'
    '단지 한가운데 깃든 정원, 도심 속에서 누리는 자연 속 휴식 — '
    '시간이 지날수록 더 깊어지는 일상의 품격을 담았습니다.',
    styles['body']
))
story.append(Spacer(1, 16))

story.append(Paragraph('CORE VALUES', styles['h_section']))
core = [
    ('NATURE INSIDE', '단지 안으로 들여놓은 사계절 정원'),
    ('EXCELLENT LOCATION', '도심과 한강이 가까운 자리'),
    ('DESIGN &amp; PLAN', '자연과 사람을 잇는 공간 설계'),
    ('SLOW COMMUNITY', '일상이 천천히 깊어지는 커뮤니티'),
]
story.append(kv_table(core))
story.append(Spacer(1, 14))

# 푸터
story.append(divider())
story.append(Spacer(1, 6))
story.append(Paragraph(
    '<font color="#c19a5b">01</font>  /  03    BRANEW PREMIUM APARTMENT',
    styles['small']
))
story.append(PageBreak())

# ============================================================
# PAGE 2 — Project Overview & Location
# ============================================================
story.append(Paragraph('02 — PROJECT OVERVIEW', styles['h_section']))
story.append(Paragraph('하나의 도시, 하나의 랜드마크.', styles['title_l']))
story.append(Paragraph(
    '서울 한강뷰에 완성되는 49층 프리미엄 단지의 사업개요.',
    styles['lead']
))
story.append(Spacer(1, 6))

overview = [
    ('사업명', 'BRANEW Premium Apartment'),
    ('위치', '서울특별시 강동구 천호동 일대'),
    ('대지면적', '약 38,420㎡'),
    ('연면적', '약 218,940㎡'),
    ('규모', '지하 4층 ~ 지상 49층 / 8개동'),
    ('총 세대수', '1,234 세대'),
    ('주차대수', '1,840대 (세대당 1.49대)'),
    ('입주예정', '2027년 6월'),
]
story.append(kv_table(overview))
story.append(Spacer(1, 22))

story.append(Paragraph('03 — LOCATION', styles['h_section']))
story.append(Paragraph('한강과 도심, 모든 것이 한 걸음.', styles['title_m']))
story.append(Paragraph(
    '천호역 5·8호선 더블 역세권. 한강과 도심을 잇는 자리, 단지 가까이에서 함께합니다.',
    styles['body']
))
story.append(Spacer(1, 10))

loc = [
    ('지하철 · 도로',
     '도보 3분 천호역 (5·8호선) · 5분 올림픽대로 IC · 15분 잠실/강남권'),
    ('백화점 · 병원 · 마트',
     '도보 5분 현대백화점 천호점 · 7분 강동성심병원 · 10분 이마트 강동/로데오거리'),
    ('초 · 중 · 고',
     '도보 5분 천일초·동신중 · 10분 광남고·한영외고'),
    ('한강 · 공원',
     '도보 7분 한강시민공원 광나루지구 · 10분 올림픽공원·길동생태공원'),
]
story.append(kv_table(loc))
story.append(Spacer(1, 14))

story.append(divider())
story.append(Spacer(1, 6))
story.append(Paragraph(
    '<font color="#c19a5b">02</font>  /  03    BRANEW PREMIUM APARTMENT',
    styles['small']
))
story.append(PageBreak())

# ============================================================
# PAGE 3 — Unit Plan & Inquiry
# ============================================================
story.append(Paragraph('04 — UNIT PLAN', styles['h_section']))
story.append(Paragraph('공간의 가치를 높이다.', styles['title_l']))
story.append(Paragraph(
    '섬세한 디테일로 완성된 공간. 브래뉴의 평면을 만나보세요.',
    styles['lead']
))
story.append(Spacer(1, 6))

story.append(unit_row(
    '84A', '총 1,234세대 중 567 세대',
    '84.98㎡', '112.25㎡', '164.35㎡',
    ['4Bay 판상형 — 채광·통풍 최적화', '팬트리 &amp; 드레스룸 — 효율적 공간'],
))
story.append(unit_row(
    '114A', '총 1,234세대 중 123 세대',
    '114.98㎡', '149.23㎡', '216.74㎡',
    ['대형 드레스룸 &amp; 팬트리', '와이드 주방 — 여유로운 동선'],
))
story.append(unit_row(
    '142A', '총 1,234세대 중 89 세대',
    '142.34㎡', '185.73㎡', '265.96㎡',
    ['와이드 4Bay — 개방감 있는 공간', '다용도실·알파룸 — 다양한 라이프스타일'],
))

story.append(Spacer(1, 18))
story.append(Paragraph('05 — INQUIRY', styles['h_section']))
story.append(Paragraph('당신이 선택한 단 하나의 공간.', styles['title_m']))
inquiry = [
    ('CALL', '1588-0000'),
    ('MODEL HOUSE', '서울 강동구 천호동 123'),
    ('EMAIL', 'sales@branew.kr'),
    ('BROCHURE', 'www.branew.kr'),
]
story.append(kv_table(inquiry))
story.append(Spacer(1, 12))

story.append(divider())
story.append(Spacer(1, 6))
story.append(Paragraph(
    '<font color="#c19a5b">03</font>  /  03    BRANEW PREMIUM APARTMENT  ·  © 2026',
    styles['small']
))
story.append(Paragraph(
    '※ 본 자료는 분양 안내를 돕기 위한 것으로 일부 변경될 수 있으며, 최종 사항은 분양 안내 자료를 따릅니다.',
    styles['small']
))

doc.build(story)
print('Created: branew-brochure.pdf')
