export default [
  {
    id: 'balanced',
    name: 'Cân bằng',
    shortDescription: 'Khẩu phần ăn cân bằng và đảm bảo dinh dưỡng.',
    description: 'Một chế độ ăn cân bằng nhấn mạnh việc tiêu thụ nhiều loại thực phẩm để cung cấp cho cơ thể đầy đủ các chất dinh dưỡng cần thiết. Nó hỗ trợ sức khỏe tổng thể bằng cách bao gồm sự pha trộn giữa carbohydrate, protein, chất béo và một lượng chất xơ đáng kể nhằm đảm bảo sức khỏe tiêu hóa.',
    image: { uri: 'https://res.cloudinary.com/dcki3gg9q/image/upload/v1760975820/image_dietType_jih90t.png' },
    nutrition: {
      calories: 2575,
      macros: [
        { name: 'Chất đạm', percentage: 20 },
        { name: 'Chất béo', percentage: 25 },
        { name: 'Carbohydrate', percentage: 55 }
      ]
    },
    recommendedFoods: [
      'Ngũ cốc nguyên hạt',
      'Rau củ đa dạng',
      'Trái cây tươi',
      'Protein nạc',
      'Sữa ít béo',
      'Dầu thực vật'
    ],
    restrictedFoods: [
      'Thực phẩm chế biến sẵn',
      'Đồ ngọt nhiều đường',
      'Thức ăn nhiều muối',
      'Thực phẩm chiên rán'
    ],
    benefits: [
      'Cung cấp đầy đủ dinh dưỡng',
      'Duy trì cân nặng ổn định',
      'Tăng cường sức khỏe tim mạch',
      'Cải thiện hệ miễn dịch'
    ]
  },
  {
    id: 'low-carb',
    name: 'Ít carbohydrate',
    shortDescription: 'Giảm lượng carbohydrate, tăng protein và chất béo lành mạnh.',
    description: 'Chế độ ăn ít carbohydrate giới hạn lượng carbs tiêu thụ và tăng cường protein, chất béo. Điều này giúp cơ thể chuyển từ việc đốt glucose sang đốt chất béo để tạo năng lượng. Chế độ này thích hợp cho người muốn giảm cân, kiểm soát lượng đường trong máu và cải thiện một số chỉ số sức khỏe.',
    image: { uri: 'https://res.cloudinary.com/dcki3gg9q/image/upload/v1760975820/image_dietType_jih90t.png' },
    nutrition: {
      calories: 2200,
      macros: [
        { name: 'Chất đạm', percentage: 35 },
        { name: 'Chất béo', percentage: 45 },
        { name: 'Carbohydrate', percentage: 20 }
      ]
    },
    recommendedFoods: [
      'Thịt, cá, trứng',
      'Rau không chứa tinh bột',
      'Các loại hạt và hạt',
      'Dầu olive, dầu dừa',
      'Bơ và cheese'
    ],
    restrictedFoods: [
      'Ngũ cốc và bánh mì',
      'Đường và đồ ngọt',
      'Trái cây ngọt',
      'Khoai tây và rau củ tinh bột',
      'Đồ uống có đường'
    ],
    benefits: [
      'Hỗ trợ giảm cân',
      'Giảm cảm giác thèm ăn',
      'Giảm mỡ bụng',
      'Cải thiện mức cholesterol',
      'Ổn định đường huyết'
    ]
  },
  {
    id: 'high-protein',
    name: 'Ăn thịt',
    shortDescription: 'Khẩu phần giàu protein giúp tăng cường cơ bắp.',
    description: 'Chế độ ăn nhiều protein nhấn mạnh vào việc tiêu thụ lượng lớn protein từ thịt, cá, trứng và các sản phẩm từ sữa. Đây là chế độ ăn phổ biến trong giới thể hình và những người muốn xây dựng cơ bắp. Protein là nền tảng cho việc phát triển cơ bắp và hỗ trợ quá trình phục hồi sau tập luyện.',
    image: { uri: 'https://res.cloudinary.com/dcki3gg9q/image/upload/v1760975820/image_dietType_jih90t.png' },
    nutrition: {
      calories: 2800,
      macros: [
        { name: 'Chất đạm', percentage: 40 },
        { name: 'Chất béo', percentage: 30 },
        { name: 'Carbohydrate', percentage: 30 }
      ]
    },
    recommendedFoods: [
      'Thịt đỏ nạc',
      'Ức gà, ức vịt',
      'Cá hồi, cá ngừ',
      'Trứng',
      'Sữa chua Hy Lạp',
      'Đậu và các loại hạt'
    ],
    restrictedFoods: [
      'Thực phẩm nhiều đường',
      'Thực phẩm chế biến sẵn',
      'Rượu bia',
      'Thực phẩm chiên nhiều dầu'
    ],
    benefits: [
      'Tăng cường phát triển cơ bắp',
      'Tăng cường trao đổi chất',
      'Giảm cảm giác đói',
      'Hỗ trợ giảm cân',
      'Duy trì khối lượng cơ trong quá trình giảm cân'
    ]
  },
  {
    id: 'whole30',
    name: 'Chế độ Whole30',
    shortDescription: 'Loại bỏ thực phẩm gây viêm, tập trung vào thực phẩm tự nhiên.',
    description: 'Whole30 là chương trình ăn uống kéo dài 30 ngày tập trung vào việc loại bỏ các nhóm thực phẩm có thể gây viêm hoặc kích ứng cho cơ thể. Sau 30 ngày, người dùng có thể từ từ đưa các thực phẩm trở lại để xác định thực phẩm nào có tác động tiêu cực đến sức khỏe của họ.',
    image: { uri: 'https://res.cloudinary.com/dcki3gg9q/image/upload/v1760975820/image_dietType_jih90t.png' },
    nutrition: {
      calories: 2400,
      macros: [
        { name: 'Chất đạm', percentage: 30 },
        { name: 'Chất béo', percentage: 40 },
        { name: 'Carbohydrate', percentage: 30 }
      ]
    },
    recommendedFoods: [
      'Thịt, hải sản và trứng',
      'Rau củ quả tươi',
      'Trái cây tự nhiên',
      'Dầu thực vật lành mạnh',
      'Các loại hạt và hạt'
    ],
    restrictedFoods: [
      'Đường và chất tạo ngọt',
      'Ngũ cốc',
      'Các loại đậu',
      'Sữa và các sản phẩm từ sữa',
      'Phụ gia và chất bảo quản',
      'Rượu và đồ uống có cồn'
    ],
    benefits: [
      'Xác định được thực phẩm gây kích ứng',
      'Giảm viêm trong cơ thể',
      'Cải thiện tiêu hóa',
      'Tăng năng lượng',
      'Cải thiện chất lượng giấc ngủ'
    ]
  }
];
