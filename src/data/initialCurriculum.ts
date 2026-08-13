import { Chapter, Lesson, Question, Badge } from '../types';

export const INITIAL_CHAPTERS: Chapter[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    number: 1,
    title: 'Chủ đề 1: Vật Lí Nhiệt',
    description: 'Thuyết động học phân tử, nội năng, định luật I NĐLH, nhiệt dung riêng, nhiệt nóng chảy và nhiệt hoá hơi.',
    icon: 'Flame',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    number: 2,
    title: 'Chủ đề 2: Khí Lí Tưởng',
    description: 'Mô hình động học phân tử chất khí, định luật Boyle, định luật Charles, phương trình trạng thái khí lí tưởng.',
    icon: 'Wind',
    color: 'from-sky-500 to-blue-500',
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    number: 3,
    title: 'Chủ đề 3: Từ Trường',
    description: 'Từ trường, lực từ, cảm ứng từ, hiện tượng cảm ứng điện từ, dòng điện xoay chiều, máy biến áp.',
    icon: 'Compass',
    color: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    number: 4,
    title: 'Chủ đề 4: Vật Lí Hạt Nhân',
    description: 'Cấu tạo hạt nhân, năng lượng liên kết, phóng xạ hạt nhân, phản ứng phân hạch, nhiệt hạch và an toàn phóng xạ.',
    icon: 'Atom',
    color: 'from-emerald-500 to-teal-600',
  },
];

export const INITIAL_LESSONS: Lesson[] = [
  // Chủ đề 1: Vật Lí Nhiệt
  {
    id: 'b1111111-1111-1111-1111-111111111101',
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
    id: 'b1111111-1111-1111-1111-111111111102',
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
    id: 'b1111111-1111-1111-1111-111111111103',
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
    id: 'b1111111-1111-1111-1111-111111111104',
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

  // Chủ đề 2: Khí Lí Tưởng
  {
    id: 'b2222222-2222-2222-2222-222222222201',
    chapter_id: 'c2222222-2222-2222-2222-222222222222',
    number: 8,
    title: 'Bài 8: Mô hình động học phân tử chất khí',
    summary: 'Khí lí tưởng, chuyển động Brown, va chạm đàn hồi của phân tử khí với thành bình tạo nên áp suất.',
    key_formulas: [
      'p = \\frac{1}{3} \\mu m \\bar{v^2} = \\frac{2}{3} \\mu \\bar{E_d}',
      '\\bar{E_d} = \\frac{3}{2} k T \\quad (k \\approx 1.38 \\times 10^{-23}\\text{ J/K})'
    ],
  },
  {
    id: 'b2222222-2222-2222-2222-222222222202',
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
    id: 'b2222222-2222-2222-2222-222222222203',
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
    id: 'b2222222-2222-2222-2222-222222222204',
    chapter_id: 'c2222222-2222-2222-2222-222222222222',
    number: 11,
    title: 'Bài 11: Phương trình trạng thái khí lí tưởng',
    summary: 'Phương trình Clapeyron - Mendeleev và phương trình trạng thái khí lí tưởng cho lượng khí bất kì.',
    key_formulas: [
      '\\frac{p V}{T} = \\text{const}',
      'p V = n R T = \\frac{m}{M} R T \\quad (R \\approx 8.31\\text{ J/mol.K})'
    ],
  },

  // Chủ đề 3: Từ Trường
  {
    id: 'b3333333-3333-3333-3333-333333333301',
    chapter_id: 'c3333333-3333-3333-3333-333333333333',
    number: 14,
    title: 'Bài 14: Từ trường & Cảm ứng từ',
    summary: 'Từ trường của các dòng điện có dạng đặc biệt (thẳng dài, tròn, ống dây), đường sức từ, từ phổ và vector cảm ứng từ.',
    key_formulas: [
      'Đường sức từ là những đường cong khép kín',
      'Quy ước: Vào Nam (S) - Ra Bắc (N)'
    ],
  },
  {
    id: 'b3333333-3333-3333-3333-333333333302',
    chapter_id: 'c3333333-3333-3333-3333-333333333333',
    number: 15,
    title: 'Bài 15: Lực từ tác dụng lên đoạn dây dẫn',
    summary: 'Lực từ tác dụng lên đoạn dây dẫn mang dòng điện đặt trong từ trường đều, quy tắc bàn tay trái.',
    key_formulas: [
      'F = B I L \\sin\\alpha',
      '1\\text{ Tesla (T)} = 1\\text{ N}/(\\text{A}\\cdot\\text{m})'
    ],
  },
  {
    id: 'b3333333-3333-3333-3333-333333333303',
    chapter_id: 'c3333333-3333-3333-3333-333333333333',
    number: 16,
    title: 'Bài 16: Hiện tượng cảm ứng điện từ',
    summary: 'Từ thông, hiện tượng cảm ứng điện từ, định luật Faraday và định luật Lenz.',
    key_formulas: [
      '\\Phi = B S \\cos\\alpha \\quad (\\text{Wb})',
      'e_c = -\\frac{\\Delta\\Phi}{\\Delta t} \\quad (\\text{V})'
    ],
  },

  // Chủ đề 4: Vật Lí Hạt Nhân
  {
    id: 'b4444444-4444-4444-4444-444444444401',
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
    id: 'b4444444-4444-4444-4444-444444444402',
    chapter_id: 'c4444444-4444-4444-4444-444444444444',
    number: 20,
    title: 'Bài 20: Phóng xạ & Phản ứng hạt nhân',
    summary: 'Định luật phóng xạ, các dạng tia phóng xạ (alpha, beta, gamma), chu kì bán rã và phản ứng phân hạch, nhiệt hạch.',
    key_formulas: [
      'N(t) = N_0 2^{-\\frac{t}{T}} = N_0 e^{-\\lambda t}',
      '\\lambda = \\frac{\\ln 2}{T} \\approx \\frac{0.693}{T}'
    ],
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  // =========================================================================
  // CHỦ ĐỀ 1: VẬT LÍ NHIỆT (Đầy đủ Nhận biết - Thông hiểu - Vận dụng)
  // =========================================================================
  {
    id: 'q-heat-1',
    lesson_id: 'b1111111-1111-1111-1111-111111111101',
    type: 'multiple_choice',
    content: 'Theo thuyết động học phân tử, các phân tử cấu tạo nên chất rắn có đặc điểm chuyển động nào sau đây?',
    options: [
      'Chuyển động tự do hỗn loạn hoàn toàn không có phương hướng xác định',
      'Dao động xung quanh các vị trí cân bằng cố định xác định',
      'Dao động xung quanh các vị trí cân bằng luôn luôn dịch chuyển',
      'Hoàn toàn đứng yên bất động ở mọi nhiệt độ'
    ],
    correct_answer: 'B',
    explanation: 'Theo mô hình động học phân tử (SGK Vật Lí 12 KNTT Bài 1): Ở thể rắn, lực tương tác giữa các phân tử rất mạnh, giữ cho các phân tử ở các vị trí xác định và chỉ dao động quanh các vị trí cân bằng cố định đó.',
    difficulty: 'easy', // Nhận biết
  },
  {
    id: 'q-heat-2',
    lesson_id: 'b1111111-1111-1111-1111-111111111104',
    type: 'multiple_choice',
    content: 'Nhiệt dung riêng $c$ của một chất là đại lượng có ý nghĩa vật lí nào sau đây?',
    options: [
      'Nhiệt lượng cần truyền để 1 kg chất đó tăng thêm $1\\text{ K}$ (hoặc $1^\\circ\\text{C}$)',
      'Nhiệt lượng cần cung cấp để 1 kg chất đó nóng chảy hoàn toàn ở nhiệt độ nóng chảy',
      'Nhiệt lượng cần cung cấp để 1 kg chất đó hoá hơi hoàn toàn ở nhiệt độ sôi',
      'Nội năng toàn phần chứa trong 1 kg khối lượng của chất đó'
    ],
    correct_answer: 'A',
    explanation: 'Từ công thức $Q = mc\\Delta t \\Rightarrow c = \\frac{Q}{m\\Delta t}$. Nhiệt dung riêng $c$ (đơn vị $\\text{J}/(\\text{kg}\\cdot\\text{K})$) là nhiệt lượng cần thiết để làm cho 1 kg chất tăng thêm $1\\text{ K}$ (hoặc $1^\\circ\\text{C}$).',
    difficulty: 'medium', // Thông hiểu
  },
  {
    id: 'q-heat-3',
    lesson_id: 'b1111111-1111-1111-1111-111111111102',
    type: 'multiple_choice',
    content: 'Một khối khí lí tưởng trong xilanh nhận nhiệt lượng $Q = 350\\text{ J}$, đồng thời dãn nở đẩy pit-tông sinh công $A\' = 200\\text{ J}$. Độ biến thiên nội năng $\\Delta U$ của khối khí là:',
    options: [
      '+550 J',
      '+150 J',
      '-150 J',
      '-550 J'
    ],
    correct_answer: 'B',
    explanation: 'Theo định luật I NĐLH: $\\Delta U = A + Q$. Khối khí nhận nhiệt lượng nên $Q = +350\\text{ J}$. Khí sinh công $A\' = 200\\text{ J} \\Rightarrow$ công khí nhận là $A = -200\\text{ J}$. Do đó $\\Delta U = -200 + 350 = +150\\text{ J}$.',
    difficulty: 'hard', // Vận dụng
  },
  {
    id: 'q-heat-4',
    lesson_id: 'b1111111-1111-1111-1111-111111111104',
    type: 'multiple_choice',
    content: 'Tính nhiệt lượng cần cung cấp để làm nóng chảy hoàn toàn $2\\text{ kg}$ nước đá ở $0^\\circ\\text{C}$, biết nhiệt nóng chảy riêng của nước đá là $\\lambda = 3.34 \\times 10^5\\text{ J/kg}$:',
    options: [
      '6.68 x 10^5 J',
      '3.34 x 10^5 J',
      '1.67 x 10^5 J',
      '6.68 x 10^4 J'
    ],
    correct_answer: 'A',
    explanation: 'Áp dụng công thức nhiệt nóng chảy: $Q = \\lambda m = (3.34 \\times 10^5\\text{ J/kg}) \\times 2\\text{ kg} = 6.68 \\times 10^5\\text{ J} = 668\\text{ kJ}$.',
    difficulty: 'hard', // Vận dụng
  },

  // =========================================================================
  // CHỦ ĐỀ 2: KHÍ LÍ TƯỞNG (Đầy đủ Nhận biết - Thông hiểu - Vận dụng)
  // =========================================================================
  {
    id: 'q-gas-1',
    lesson_id: 'b2222222-2222-2222-2222-222222222201',
    type: 'multiple_choice',
    content: 'Trong mô hình động học phân tử chất khí lí tưởng, các phân tử khí được coi là:',
    options: [
      'Các chất điểm có thể tích riêng vô cùng lớn so với bình chứa',
      'Các chất điểm có khối lượng và chỉ tương tác với nhau khi va chạm',
      'Các hạt luôn luôn hút nhau với lực hấp dẫn rất mạnh ở khoảng cách xa',
      'Các vật rắn hình cầu đứng yên trong không gian bình chứa'
    ],
    correct_answer: 'B',
    explanation: 'Đặc điểm của khí lí tưởng: Các phân tử khí được coi là các chất điểm có khối lượng, chuyển động hỗn loạn không ngừng và chỉ tương tác với nhau khi va chạm đàn hồi.',
    difficulty: 'easy', // Nhận biết
  },
  {
    id: 'q-gas-2',
    lesson_id: 'b2222222-2222-2222-2222-222222222202',
    type: 'multiple_choice',
    content: 'Trong quá trình biến đổi đẳng nhiệt của một khối lượng khí lí tưởng xác định, đồ thị biểu diễn mối quan hệ giữa áp suất $p$ và thể tích $V$ trong hệ tọa độ $(p, V)$ có dạng là:',
    options: [
      'Một đường thẳng đi qua gốc tọa độ O',
      'Một nhánh của đường hyperbol',
      'Một đường thẳng song song với trục hoành OV',
      'Một đường elip khép kín'
    ],
    correct_answer: 'B',
    explanation: 'Theo định luật Boyle: $p \\cdot V = \\text{const} \\Rightarrow p = \\frac{\\text{const}}{V}$. Mối quan hệ tỉ lệ nghịch này được biểu diễn bằng một nhánh đường hyperbol trên hệ trục $(p, V)$.',
    difficulty: 'medium', // Thông hiểu
  },
  {
    id: 'q-gas-3',
    lesson_id: 'b2222222-2222-2222-2222-222222222202',
    type: 'multiple_choice',
    content: 'Một khối khí lí tưởng có thể tích $V_1 = 6\\text{ lít}$ ở áp suất $p_1 = 1.5\\text{ bar}$. Nếu nén đẳng nhiệt khối khí đến thể tích $V_2 = 2\\text{ lít}$ thì áp suất $p_2$ của khí trong bình là:',
    options: [
      '4.5 bar',
      '3.0 bar',
      '0.5 bar',
      '2.25 bar'
    ],
    correct_answer: 'A',
    explanation: 'Áp dụng định luật Boyle cho quá trình đẳng nhiệt: $p_1 V_1 = p_2 V_2 \\Rightarrow p_2 = \\frac{p_1 V_1}{V_2} = \\frac{1.5 \\times 6}{2} = 4.5\\text{ bar}$.',
    difficulty: 'hard', // Vận dụng
  },
  {
    id: 'q-gas-4',
    lesson_id: 'b2222222-2222-2222-2222-222222222204',
    type: 'multiple_choice',
    content: 'Tính thể tích $V$ của $1\\text{ mol}$ khí lí tưởng ở điều kiện tiêu chuẩn nhiệt độ $T = 273.15\\text{ K}$ ($0^\\circ\\text{C}$) và áp suất $p = 10^5\\text{ Pa}$, lấy $R = 8.314\\text{ J/mol.K}$:',
    options: [
      '22.71 lít (0.02271 m³)',
      '24.79 lít (0.02479 m³)',
      '22.40 lít (0.02240 m³)',
      '18.50 lít (0.01850 m³)'
    ],
    correct_answer: 'A',
    explanation: 'Theo phương trình Clapeyron - Mendeleev: $pV = nRT \\Rightarrow V = \\frac{nRT}{p} = \\frac{1 \\times 8.314 \\times 273.15}{10^5} \\approx 0.02271\\text{ m}^3 = 22.71\\text{ lít}$. (Theo chuẩn IUPAC mới áp suất $1\\text{ bar} = 10^5\\text{ Pa}$).',
    difficulty: 'hard', // Vận dụng
  },

  // =========================================================================
  // CHỦ ĐỀ 3: TỪ TRƯỜNG (Đầy đủ Nhận biết - Thông hiểu - Vận dụng)
  // =========================================================================
  {
    id: 'q-mag-1',
    lesson_id: 'b3333333-3333-3333-3333-333333333301',
    type: 'multiple_choice',
    content: 'Đường sức từ của một nam châm thẳng bên ngoài thanh nam châm có quy ước chiều như thế nào?',
    options: [
      'Đi vào từ cực Bắc (N) và đi ra ở cực Nam (S)',
      'Đi vào từ cực Nam (S) và đi ra ở cực Bắc (N)',
      'Đi từ tâm nam châm tỏa đều ra vô cực',
      'Đều hướng vuông góc với trục của thanh nam châm'
    ],
    correct_answer: 'B',
    explanation: 'Quy ước chiều của đường sức từ bên ngoài nam châm: "Vào Nam (S) - Ra Bắc (N)". Bên trong lòng nam châm thì đi từ cực Nam sang cực Bắc tạo thành đường cong khép kín.',
    difficulty: 'easy', // Nhận biết
  },
  {
    id: 'q-mag-2',
    lesson_id: 'b3333333-3333-3333-3333-333333333302',
    type: 'multiple_choice',
    content: 'Để xác định chiều của lực từ $\\vec{F}$ tác dụng lên một đoạn dây dẫn mang dòng điện đặt trong từ trường đều, ta sử dụng quy tắc nào sau đây?',
    options: [
      'Quy tắc bàn tay phải',
      'Quy tắc bàn tay trái',
      'Quy tắc cái đinh ốc',
      'Quy tắc nắm tay phải'
    ],
    correct_answer: 'B',
    explanation: 'Quy tắc bàn tay trái: Đặt bàn tay trái sao cho các đường sức từ hướng vào lòng bàn tay, chiều từ cổ tay đến ngón giữa là chiều dòng điện thì ngón cái choãi ra $90^\\circ$ chỉ chiều của lực từ.',
    difficulty: 'medium', // Thông hiểu
  },
  {
    id: 'q-mag-3',
    lesson_id: 'b3333333-3333-3333-3333-333333333302',
    type: 'multiple_choice',
    content: 'Một đoạn dây dẫn thẳng dài $L = 0.5\\text{ m}$ mang dòng điện $I = 4\\text{ A}$ đặt vuông góc với vectơ cảm ứng từ của từ trường đều có độ lớn $B = 0.25\\text{ T}$. Độ lớn lực từ tác dụng lên đoạn dây là:',
    options: [
      '0.5 N',
      '0.25 N',
      '1.0 N',
      '0.1 N'
    ],
    correct_answer: 'A',
    explanation: 'Áp dụng công thức lực từ Laplace: $F = BIL\\sin\\alpha = 0.25 \\times 4 \\times 0.5 \\times \\sin(90^\\circ) = 0.5\\text{ N}$.',
    difficulty: 'hard', // Vận dụng
  },
  {
    id: 'q-mag-4',
    lesson_id: 'b3333333-3333-3333-3333-333333333303',
    type: 'multiple_choice',
    content: 'Một khung dây phẳng có diện tích $S = 20\\text{ cm}^2$ ($2 \\times 10^{-3}\\text{ m}^2$) đặt trong từ trường đều có $B = 0.05\\text{ T}$. Từ thông cực đại $\\Phi_0$ gửi qua khung dây khi mặt phẳng khung vuông góc với đường sức từ là:',
    options: [
      '1.0 x 10^-4 Wb',
      '2.0 x 10^-4 Wb',
      '4.0 x 10^-4 Wb',
      '1.0 x 10^-3 Wb'
    ],
    correct_answer: 'A',
    explanation: 'Khi mặt phẳng khung vuông góc với đường sức từ thì góc giữa pháp tuyến $\\vec{n}$ và $\\vec{B}$ là $\\alpha = 0^\\circ \\Rightarrow \\cos(0^\\circ) = 1$. Ta có $\\Phi = BS\\cos(0^\\circ) = 0.05 \\times (2 \\times 10^{-3}) = 1.0 \\times 10^{-4}\\text{ Wb}$.',
    difficulty: 'hard', // Vận dụng
  },

  // =========================================================================
  // CHỦ ĐỀ 4: VẬT LÍ HẠT NHÂN (Đầy đủ Nhận biết - Thông hiểu - Vận dụng)
  // =========================================================================
  {
    id: 'q-nuc-1',
    lesson_id: 'b4444444-4444-4444-4444-444444444401',
    type: 'multiple_choice',
    content: 'Hạt nhân nguyên tử $^{238}_{92}\\text{U}$ có cấu tạo gồm bao nhiêu hạt proton và bao nhiêu hạt neutron?',
    options: [
      '92 proton và 146 neutron',
      '92 proton và 238 neutron',
      '146 proton và 92 neutron',
      '238 proton và 92 neutron'
    ],
    correct_answer: 'A',
    explanation: 'Kí hiệu hạt nhân $^A_Z\\text{X}$: Số proton là $Z = 92$, số khối là $A = 238$. Số neutron là $N = A - Z = 238 - 92 = 146\\text{ neutron}$.',
    difficulty: 'easy', // Nhận biết
  },
  {
    id: 'q-nuc-2',
    lesson_id: 'b4444444-4444-4444-4444-444444444401',
    type: 'multiple_choice',
    content: 'Đại lượng nào sau đây quyết định trực tiếp mức độ bền vững của một hạt nhân nguyên tử?',
    options: [
      'Năng lượng liên kết riêng $W_{lkr} = \\frac{W_{lk}}{A}$',
      'Năng lượng liên kết toàn phần $W_{lk}$',
      'Khối lượng toàn phần của hạt nhân $m_X$',
      'Độ hụt khối toàn phần $\\Delta m$'
    ],
    correct_answer: 'A',
    explanation: 'Năng lượng liên kết riêng $W_{lkr} = \\frac{W_{lk}}{A}$ (tính trên 1 nucleon) là đại lượng đặc trưng cho độ bền vững của hạt nhân. Hạt nhân có năng lượng liên kết riêng càng lớn thì càng bền vững (bền vững nhất ở các hạt nhân có $A$ từ $50$ đến $70$).',
    difficulty: 'medium', // Thông hiểu
  },
  {
    id: 'q-nuc-3',
    lesson_id: 'b4444444-4444-4444-4444-444444444402',
    type: 'multiple_choice',
    content: 'Chất phóng xạ Radon $^{222}_{86}\\text{Rn}$ có chu kì bán rã $T = 3.8\\text{ ngày}$. Sau thời gian $t = 11.4\\text{ ngày}$, tỉ lệ phần trăm số hạt nhân Radon còn lại chưa bị phân rã là:',
    options: [
      '12.5%',
      '25.0%',
      '50.0%',
      '6.25%'
    ],
    correct_answer: 'A',
    explanation: 'Số chu kì bán rã đã trôi qua là $k = \\frac{t}{T} = \\frac{11.4}{3.8} = 3$. Theo định luật phóng xạ: $\\frac{N(t)}{N_0} = 2^{-k} = 2^{-3} = \\frac{1}{8} = 12.5\\%$.',
    difficulty: 'hard', // Vận dụng
  },
  {
    id: 'q-nuc-4',
    lesson_id: 'b4444444-4444-4444-4444-444444444401',
    type: 'multiple_choice',
    content: 'Biết độ hụt khối của hạt nhân Heli $^4_2\\text{He}$ là $\\Delta m = 0.0304\\text{ amu}$. Lấy $1\\text{ amu} \\cdot c^2 \\approx 931.5\\text{ MeV}$. Năng lượng liên kết riêng của hạt nhân Heli là:',
    options: [
      '7.08 MeV/nucleon',
      '28.32 MeV/nucleon',
      '14.16 MeV/nucleon',
      '3.54 MeV/nucleon'
    ],
    correct_answer: 'A',
    explanation: 'Năng lượng liên kết toàn phần: $W_{lk} = \\Delta m \\cdot c^2 = 0.0304 \\times 931.5 \\approx 28.318\\text{ MeV}$. Số khối $A = 4$. Suy ra năng lượng liên kết riêng $W_{lkr} = \\frac{W_{lk}}{4} = \\frac{28.318}{4} \\approx 7.08\\text{ MeV/nucleon}$.',
    difficulty: 'hard', // Vận dụng
  },

  // =========================================================================
  // CÂU HỎI ĐÚNG / SAI 4 Ý (True / False Matrix chuẩn THPT)
  // =========================================================================
  {
    id: 'q-tf-1',
    lesson_id: 'b1111111-1111-1111-1111-111111111101',
    type: 'true_false',
    content: 'Khi nói về mô hình cấu trúc của chất và sự chuyển thể theo SGK Vật Lí 12 KNTT, xét tính Đúng / Sai của các nhận định sau:',
    options: [
      { id: 'a', text: 'Ở thể rắn, các phân tử dao động quanh các vị trí cân bằng cố định xác định.' },
      { id: 'b', text: 'Khoảng cách trung bình giữa các phân tử ở thể khí lớn hơn rất nhiều so với thể lỏng và thể rắn.' },
      { id: 'c', text: 'Trong suốt quá trình nóng chảy của chất rắn kết tinh, nhiệt độ của vật liên tục tăng lên theo thời gian.' },
      { id: 'd', text: 'Nhiệt nóng chảy riêng $\\lambda$ có đơn vị đo chuẩn trong hệ SI là $\\text{J}/\\text{kg}$.' }
    ],
    correct_answer: [true, true, false, true],
    explanation: 'Ý a: Đúng (Đặc điểm trật tự thể rắn). Ý b: Đúng (Thể khí loãng). Ý c: Sai (Chất rắn kết tinh giữ nguyên nhiệt độ nóng chảy suốt quá trình cho tới khi tan chảy hoàn toàn). Ý d: Đúng ($Q = \\lambda m \\Rightarrow \\lambda = Q/m$ tính bằng $\\text{J}/\\text{kg}$).',
    difficulty: 'medium',
  },
  {
    id: 'q-tf-2',
    lesson_id: 'b2222222-2222-2222-2222-222222222204',
    type: 'true_false',
    content: 'Xét một lượng khí lí tưởng xác định biến đổi trạng thái trong xilanh kín. Đánh giá tính Đúng / Sai của các mệnh đề sau:',
    options: [
      { id: 'a', text: 'Trong hệ tọa độ $(p, V)$, đường đẳng nhiệt là một nhánh của đường hyperbol.' },
      { id: 'b', text: 'Độ biến thiên nhiệt độ $\\Delta T$ theo thang Kelvin luôn bằng độ biến thiên $\\Delta t$ theo thang Celsius.' },
      { id: 'c', text: 'Hằng số chất khí $R$ trong phương trình Clapeyron - Mendeleev có giá trị xấp xỉ $8.314\\text{ J}/(\\text{mol}\\cdot\\text{K})$.' },
      { id: 'd', text: 'Khi tăng nhiệt độ tuyệt đối của một khối khí lên 2 lần thì động năng tịnh tiến trung bình của phân tử giảm 2 lần.' }
    ],
    correct_answer: [true, true, true, false],
    explanation: 'Ý a: Đúng ($p \\sim 1/V$). Ý b: Đúng ($\\Delta T = \\Delta t$). Ý c: Đúng ($R \\approx 8.314$). Ý d: Sai (Động năng trung bình $\\bar{E_d} = \\frac{3}{2} k T$ tỉ lệ thuận với $T$, khi $T$ tăng 2 lần thì động năng tăng 2 lần).',
    difficulty: 'medium',
  },

  // =========================================================================
  // CÂU HỎI NỐI TỪ / GHÉP CẶP (Matching)
  // =========================================================================
  {
    id: 'q-mat-1',
    lesson_id: 'b4444444-4444-4444-4444-444444444402',
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
    lesson_id: 'b1111111-1111-1111-1111-111111111104',
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
    description: 'Đạt điểm tuyệt đối chủ đề Vật lí nhiệt',
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
