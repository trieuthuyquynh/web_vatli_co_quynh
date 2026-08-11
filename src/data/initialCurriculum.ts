import { Chapter, Lesson, Question, Badge } from '../types';

export const INITIAL_CHAPTERS: Chapter[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    number: 1,
    title: 'Chương 1: Vật Lí Nhiệt',
    description: 'Mô hình cấu trúc chất, nội năng, định luật 1 NĐLH, nhiệt dung riêng, nhiệt nóng chảy và nhiệt hoá hơi.',
    icon: 'Flame',
    color: 'from-amber-500 to-red-500',
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    number: 2,
    title: 'Chương 2: Khí Lí Tưởng',
    description: 'Mô hình động học phân tử chất khí, định luật Boyle, định luật Charles, phương trình trạng thái khí lí tưởng.',
    icon: 'Wind',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    number: 3,
    title: 'Chương 3: Từ Trường',
    description: 'Từ trường, lực từ, cảm ứng từ, hiện tượng cảm ứng điện từ, dòng điện xoay chiều, máy biến áp.',
    icon: 'Zap',
    color: 'from-yellow-400 to-amber-600',
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    number: 4,
    title: 'Chương 4: Vật Lí Hạt Nhân',
    description: 'Cấu tạo hạt nhân, năng lượng liên kết, phóng xạ hạt nhân, phản ứng phân hạch, nhiệt hạch và an toàn phóng xạ.',
    icon: 'Atom',
    color: 'from-emerald-500 to-teal-600',
  },
];

export const INITIAL_LESSONS: Lesson[] = [
  // Chương 1
  {
    id: 'l1111111-1111-1111-1111-111111111101',
    chapter_id: 'c1111111-1111-1111-1111-111111111111',
    number: 1,
    title: 'Bài 1: Cấu trúc của chất. Sự chuyển thể',
    summary: 'Các thể của chất (rắn, lỏng, khí), mô hình động học phân tử, các quá trình chuyển thể (nóng chảy, đông đặc, hoá hơi, ngưng tụ, thăng hoa).',
    key_formulas: [
      'Thể rắn: Phân tử dao động quanh vị trí cân bằng cố định',
      'Thể lỏng: Phân tử dao động quanh VTCB dịch chuyển được',
      'Thể khí: Phân tử chuyển động hỗn loạn không ngừng'
    ],
  },
  {
    id: 'l1111111-1111-1111-1111-111111111102',
    chapter_id: 'c1111111-1111-1111-1111-111111111111',
    number: 2,
    title: 'Bài 2: Nội năng. Định luật I của nhiệt động lực học',
    summary: 'Khái niệm nội năng, hai cách làm biến đổi nội năng (thực hiện công, truyền nhiệt), định luật I NĐLH và quy ước dấu.',
    key_formulas: [
      '\\Delta U = A + Q',
      'Q > 0 \\text{ (Nhận nhiệt)}, Q < 0 \\text{ (Tỏa nhiệt)}',
      'A > 0 \\text{ (Nhận công)}, A < 0 \\text{ (Thực hiện công)}'
    ],
  },
  {
    id: 'l1111111-1111-1111-1111-111111111103',
    chapter_id: 'c1111111-1111-1111-1111-111111111111',
    number: 3,
    title: 'Bài 3: Nhiệt độ. Thang nhiệt độ - nhiệt kế',
    summary: 'Trạng thái cân bằng nhiệt, định luật zero NĐLH, thang nhiệt độ Celsius và Kelvin, nguyên lí đo nhiệt độ.',
    key_formulas: [
      'T(K) = t(^\\circ C) + 273.15',
      '\\Delta T(K) = \\Delta t(^\\circ C)'
    ],
  },
  {
    id: 'l1111111-1111-1111-1111-111111111104',
    chapter_id: 'c1111111-1111-1111-1111-111111111111',
    number: 4,
    title: 'Bài 4: Nhiệt dung riêng, nhiệt nóng chảy riêng, nhiệt hoá hơi riêng',
    summary: 'Định nghĩa, ý nghĩa vật lí và công thức tính nhiệt lượng trong các quá trình truyền nhiệt và chuyển thể.',
    key_formulas: [
      'Q = m c \\Delta t \\text{ (Nhiệt dung riêng c: J/kg.K)}',
      'Q = \\lambda m \\text{ (Nhiệt nóng chảy riêng } \\lambda \\text{: J/kg)}',
      'Q = L m \\text{ (Nhiệt hoá hơi riêng L: J/kg)}'
    ],
  },

  // Chương 2
  {
    id: 'l2222222-2222-2222-2222-222222222201',
    chapter_id: 'c2222222-2222-2222-2222-222222222222',
    number: 8,
    title: 'Bài 8: Mô hình động học phân tử chất khí',
    summary: 'Khí lí tưởng, chuyển động Brown, va chạm đàn hồi của phân tử khí với thành bình tạo nên áp suất.',
    key_formulas: [
      'Phân tử khí coi là chất điểm có khối lượng',
      'Tương tác giữa các phân tử chỉ đáng kể khi va chạm'
    ],
  },
  {
    id: 'l2222222-2222-2222-2222-222222222202',
    chapter_id: 'c2222222-2222-2222-2222-222222222222',
    number: 9,
    title: 'Bài 9: Định luật Boyle (Đẳng nhiệt)',
    summary: 'Quá trình đẳng nhiệt của một lượng khí lí tưởng xác định, áp suất tỉ lệ nghịch với thể tích.',
    key_formulas: [
      'p_1 V_1 = p_2 V_2 = \\text{hằng số}',
      'p \\sim \\frac{1}{V}'
    ],
  },
  {
    id: 'l2222222-2222-2222-2222-222222222203',
    chapter_id: 'c2222222-2222-2222-2222-222222222222',
    number: 10,
    title: 'Bài 10: Định luật Charles (Đẳng áp)',
    summary: 'Quá trình đẳng áp của một lượng khí xác định, thể tích tỉ lệ thuận với nhiệt độ tuyệt đối.',
    key_formulas: [
      '\\frac{V_1}{T_1} = \\frac{V_2}{T_2} = \\text{hằng số}',
      'V \\sim T \\text{ (T tính theo Kelvin)}'
    ],
  },
  {
    id: 'l2222222-2222-2222-2222-222222222204',
    chapter_id: 'c2222222-2222-2222-2222-222222222222',
    number: 11,
    title: 'Bài 11: Phương trình trạng thái khí lí tưởng',
    summary: 'Phương trình Clapeyron - Mendeleev và phương trình trạng thái khí lí tưởng cho lượng khí bất kì.',
    key_formulas: [
      '\\frac{p V}{T} = \\text{const}',
      'p V = n R T = \\frac{m}{M} R T \\quad (R \\approx 8.31\\text{ J/mol.K})'
    ],
  },

  // Chương 3
  {
    id: 'l3333333-3333-3333-3333-333333333301',
    chapter_id: 'c3333333-3333-3333-3333-333333333333',
    number: 14,
    title: 'Bài 14: Từ trường',
    summary: 'Từ trường của các dòng điện có dạng đặc biệt (thẳng dài, tròn, ống dây), đường sức từ, từ phổ.',
    key_formulas: [
      'Đường sức từ là những đường cong khép kín',
      'Quy ước: Vào Nam (S) - Ra Bắc (N)'
    ],
  },
  {
    id: 'l3333333-3333-3333-3333-333333333302',
    chapter_id: 'c3333333-3333-3333-3333-333333333333',
    number: 15,
    title: 'Bài 15: Lực từ. Cảm ứng từ',
    summary: 'Lực từ tác dụng lên đoạn dây dẫn mang dòng điện đặt trong từ trường, quy tắc bàn tay trái.',
    key_formulas: [
      'F = B I L \\sin\\alpha',
      '1\\text{ Tesla (T)} = 1\\text{ N}/(\\text{A}\\cdot\\text{m})'
    ],
  },
  {
    id: 'l3333333-3333-3333-3333-333333333303',
    chapter_id: 'c3333333-3333-3333-3333-333333333333',
    number: 16,
    title: 'Bài 16: Hiện tượng cảm ứng điện từ',
    summary: 'Từ thông, hiện tượng cảm ứng điện từ, định luật Faraday và định luật Lenz.',
    key_formulas: [
      '\\Phi = B S \\cos\\alpha \\quad (\\text{Wb})',
      'e_c = -\\frac{\\Delta\\Phi}{\\Delta t}'
    ],
  },

  // Chương 4
  {
    id: 'l4444444-4444-4444-4444-444444444401',
    chapter_id: 'c4444444-4444-4444-4444-444444444444',
    number: 19,
    title: 'Bài 19: Cấu tạo hạt nhân. Năng lượng liên kết',
    summary: 'Proton, neutron, độ hụt khối, năng lượng liên kết và năng lượng liên kết riêng quyết định độ bền vững của hạt nhân.',
    key_formulas: [
      'E = m c^2',
      '\\Delta m = [Z m_p + (A - Z) m_n] - m_X',
      'W_{lk} = \\Delta m c^2',
      'W_{lkr} = \\frac{W_{lk}}{A}'
    ],
  },
  {
    id: 'l4444444-4444-4444-4444-444444444402',
    chapter_id: 'c4444444-4444-4444-4444-444444444444',
    number: 20,
    title: 'Bài 20: Phóng xạ',
    summary: 'Định luật phóng xạ, các dạng tia phóng xạ (alpha, beta, gamma), chu kì bán rã và hằng số phóng xạ.',
    key_formulas: [
      'N(t) = N_0 2^{-\\frac{t}{T}} = N_0 e^{-\\lambda t}',
      '\\lambda = \\frac{\\ln 2}{T} \\approx \\frac{0.693}{T}'
    ],
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  // 1. TRẮC NGHIỆM 4 ĐÁP ÁN (Multiple Choice)
  {
    id: 'q-mc-1',
    lesson_id: 'l1111111-1111-1111-1111-111111111102',
    type: 'multiple_choice',
    content: 'Một khối khí lí tưởng nhận nhiệt lượng $Q = 250\\text{ J}$ và dãn nở sinh công $A\' = 150\\text{ J}$ đẩy pit-tông. Theo định luật I nhiệt động lực học, độ biến thiên nội năng $\\Delta U$ của khối khí là:',
    options: ['+400 J', '+100 J', '-100 J', '-400 J'],
    correct_answer: 'B',
    explanation: 'Theo quy ước dấu: Khối khí nhận nhiệt lượng nên $Q = +250\\text{ J}$. Khí sinh công $A\' = 150\\text{ J} \\Rightarrow$ công khí nhận là $A = -150\\text{ J}$. Ta có $\\Delta U = A + Q = -150 + 250 = +100\\text{ J}$.',
    difficulty: 'easy',
  },
  {
    id: 'q-mc-2',
    lesson_id: 'l2222222-2222-2222-2222-222222222202',
    type: 'multiple_choice',
    content: 'Một khối khí lí tưởng có thể tích $V_1 = 4\\text{ lít}$ ở áp suất $p_1 = 1\\text{ bar}$. Nếu nén đẳng nhiệt khối khí đến thể tích $V_2 = 2\\text{ lít}$ thì áp suất $p_2$ là:',
    options: ['0.5 bar', '1.5 bar', '2.0 bar', '4.0 bar'],
    correct_answer: 'C',
    explanation: 'Vì quá trình đẳng nhiệt ($T = \\text{const}$), theo định luật Boyle: $p_1 V_1 = p_2 V_2 \\Rightarrow p_2 = \\frac{p_1 V_1}{V_2} = \\frac{1 \\times 4}{2} = 2.0\\text{ bar}$.',
    difficulty: 'easy',
  },
  {
    id: 'q-mc-3',
    lesson_id: 'l4444444-4444-4444-4444-444444444401',
    type: 'multiple_choice',
    content: 'Đại lượng nào sau đây đặc trưng cho mức độ bền vững của một hạt nhân nguyên tử?',
    options: [
      'Năng lượng liên kết $W_{lk}$',
      'Năng lượng liên kết riêng $W_{lkr}$',
      'Độ hụt khối $\\Delta m$',
      'Số khối $A$'
    ],
    correct_answer: 'B',
    explanation: 'Năng lượng liên kết riêng $W_{lkr} = \\frac{W_{lk}}{A}$ (tính trên 1 nucleon) là đại lượng đặc trưng cho độ bền vững của hạt nhân. Năng lượng liên kết riêng càng lớn thì hạt nhân càng bền vững.',
    difficulty: 'medium',
  },
  {
    id: 'q-mc-4',
    lesson_id: 'l3333333-3333-3333-3333-333333333302',
    type: 'multiple_choice',
    content: 'Một đoạn dây dẫn thẳng dài $L = 0.2\\text{ m}$ mang dòng điện $I = 5\\text{ A}$ đặt vuông góc với các đường sức của một từ trường đều có cảm ứng từ $B = 0.4\\text{ T}$. Lực từ tác dụng lên đoạn dây có độ lớn là:',
    options: ['0.4 N', '0.2 N', '0.8 N', '0.04 N'],
    correct_answer: 'A',
    explanation: 'Áp dụng công thức lực từ: $F = B I L \\sin\\alpha = 0.4 \\times 5 \\times 0.2 \\times \\sin(90^\\circ) = 0.4\\text{ N}$.',
    difficulty: 'medium',
  },

  // 2. ĐÚNG / SAI 4 Ý (True / False Matrix)
  {
    id: 'q-tf-1',
    lesson_id: 'l1111111-1111-1111-1111-111111111101',
    type: 'true_false',
    content: 'Khi nói về mô hình cấu trúc của chất và sự chuyển thể theo SGK Vật Lí 12 KNTT, xét tính Đúng / Sai của các nhận định sau:',
    options: [
      { id: 'a', text: 'Ở thể rắn, các phân tử dao động quanh các vị trí cân bằng cố định xác định.' },
      { id: 'b', text: 'Khoảng cách trung bình giữa các phân tử ở thể khí lớn hơn rất nhiều so với thể lỏng và thể rắn.' },
      { id: 'c', text: 'Trong suốt quá trình nóng chảy của chất rắn kết tinh, nhiệt độ của vật liên tục tăng lên theo thời gian.' },
      { id: 'd', text: 'Nhiệt nóng chảy riêng $\\lambda$ có đơn vị đo chuẩn trong hệ SI là $\\text{J}/\\text{kg}$.' }
    ],
    correct_answer: [true, true, false, true],
    explanation: 'Ý a: Đúng (Đặc điểm trật tự thể rắn). Ý b: Đúng (Thể khí loãng). Ý c: Sai (Chất rắn kết tinh giữ nguyên nhiệt độ nóng chảy suốt quá trình). Ý d: Đúng ($Q = \\lambda m \\Rightarrow \\lambda = Q/m$ tính bằng $\\text{J}/\\text{kg}$).',
    difficulty: 'medium',
  },
  {
    id: 'q-tf-2',
    lesson_id: 'l2222222-2222-2222-2222-222222222204',
    type: 'true_false',
    content: 'Xét một lượng khí lí tưởng xác định biến đổi trạng thái trong xilanh kín. Đánh giá tính Đúng / Sai của các mệnh đề sau:',
    options: [
      { id: 'a', text: 'Trong hệ tọa độ $(p, V)$, đường đẳng nhiệt là một nhánh của đường hyperbol.' },
      { id: 'b', text: 'Độ biến thiên nhiệt độ $\\Delta T$ theo thang Kelvin luôn bằng độ biến thiên $\\Delta t$ theo thang Celsius.' },
      { id: 'c', text: 'Hằng số chất khí $R$ trong phương trình Clapeyron - Mendeleev có giá trị xấp xỉ $8.31\\text{ J}/(\\text{mol}\\cdot\\text{K})$.' },
      { id: 'd', text: 'Khi tăng nhiệt độ tuyệt đối của một khối khí lên 2 lần thì động năng tịnh tiến trung bình của phân tử giảm 2 lần.' }
    ],
    correct_answer: [true, true, true, false],
    explanation: 'Ý a: Đúng ($p \\sim 1/V$). Ý b: Đúng ($\\\\Delta T = \\Delta t$). Ý c: Đúng ($R \\approx 8.314$). Ý d: Sai (Động năng trung bình $\\bar{E_d} = \\frac{3}{2} k T$ tỉ lệ thuận với $T$, khi $T$ tăng 2 lần thì động năng tăng 2 lần).',
    difficulty: 'medium',
  },

  // 3. NỐI TỪ / GHÉP CẶP (Matching)
  {
    id: 'q-mat-1',
    lesson_id: 'l4444444-4444-4444-4444-444444444402',
    type: 'matching',
    content: 'Hãy ghép đúng loại tia phóng xạ ở Cột A với bản chất và đặc tính tương ứng ở Cột B:',
    options: {
      left: [
        { id: 'L1', text: 'Tia Alpha ($\\alpha$)' },
        { id: 'L2', text: 'Tia Beta trừ ($\\beta^-$)' },
        { id: 'L3', text: 'Tia Beta cộng ($\\beta^+$)' },
        { id: 'L4', text: 'Tia Gamma ($\\gamma$)' }
      ],
      right: [
        { id: 'R1', text: 'Dòng hạt nhân Heli ($^4_2\\text{He}$), ion hóa mạnh, bị chặn bởi tờ giấy' },
        { id: 'R2', text: 'Dòng các electron ($^0_{-1}e$), bị lệch về bản dương trong điện trường' },
        { id: 'R3', text: 'Dòng các positron ($^0_{+1}e$), phản hạt của electron' },
        { id: 'R4', text: 'Sóng điện từ bước sóng cực ngắn, đâm xuyên mạnh nhất, không mang điện' }
      ]
    },
    correct_answer: { L1: 'R1', L2: 'R2', L3: 'R3', L4: 'R4' },
    explanation: 'Ghép chính xác bản chất: Tia $\\alpha$ là hạt Heli; Tia $\\beta^-$ là electron; Tia $\\beta^+$ là positron; Tia $\\gamma$ là photon điện từ năng lượng cao.',
    difficulty: 'hard',
  },
  {
    id: 'q-mat-2',
    lesson_id: 'l1111111-1111-1111-1111-111111111104',
    type: 'matching',
    content: 'Hãy ghép các đại lượng nhiệt học ở Cột A với công thức tương ứng ở Cột B:',
    options: {
      left: [
        { id: 'L1', text: 'Nhiệt lượng tăng giảm nhiệt độ' },
        { id: 'L2', text: 'Nhiệt lượng nóng chảy hoàn toàn' },
        { id: 'L3', text: 'Nhiệt lượng hoá hơi hoàn toàn' },
        { id: 'L4', text: 'Định luật I Nhiệt động lực học' }
      ],
      right: [
        { id: 'R1', text: '$Q = m c \\Delta t$' },
        { id: 'R2', text: '$Q = \\lambda m$' },
        { id: 'R3', text: '$Q = L m$' },
        { id: 'R4', text: '$\\Delta U = A + Q$' }
      ]
    },
    correct_answer: { L1: 'R1', L2: 'R2', L3: 'R3', L4: 'R4' },
    explanation: 'Khớp nối chính xác các công thức căn bản SGK Vật Lí 12 KNTT Chương 1.',
    difficulty: 'easy',
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'b-1',
    title: 'Tân Binh Vật Lí',
    description: 'Hoàn thành bài luyện tập đầu tiên',
    icon: 'Compass',
    criteria_type: 'quizzes_completed',
    criteria_value: 1,
    unlocked: true,
  },
  {
    id: 'b-2',
    title: 'Bậc Thầy Nhiệt Học',
    description: 'Đạt điểm tuyệt đối chương Vật lí nhiệt',
    icon: 'Flame',
    criteria_type: 'score_10',
    criteria_value: 1,
  },
  {
    id: 'b-3',
    title: 'Chiến Binh Khí Lí Tưởng',
    description: 'Đạt 500 XP từ các trò chơi',
    icon: 'Zap',
    criteria_type: 'xp',
    criteria_value: 500,
  },
  {
    id: 'b-4',
    title: 'Nhà Bác Học Nguyên Tử',
    description: 'Đạt 1500 XP và hoàn thành 10 bài tập',
    icon: 'Atom',
    criteria_type: 'xp',
    criteria_value: 1500,
  },
  {
    id: 'b-5',
    title: 'Kỉ Lục Gia 10 Điểm',
    description: 'Đạt 5 lần điểm 10 trắc nghiệm',
    icon: 'Trophy',
    criteria_type: 'score_10',
    criteria_value: 5,
  }
];
