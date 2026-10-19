export interface WishCategory {
  id: 'romantic' | 'family' | 'friend' | 'sweet';
  label: string;
  icon: string;
}

export const TOPIC_LABELS: Record<string, string> = {
  all: 'Tất cả chủ đề',
  romantic: 'Người yêu / Vợ',
  family: 'Mẹ & Người thân',
  friend: 'Bạn bè & Tri kỷ',
  sweet: 'Ngọt ngào & Hóm hỉnh',
};

export const PERSONAL_WISHES: Record<string, string[]> = {
  romantic: [
    'Chúc {to} ngày 20/10 ngập tràn niềm vui, hoa và quà. Cảm ơn vì đã đến và làm cuộc sống của {from} trở nên ấm áp, ngọt ngào và trọn vẹn hơn mỗi ngày.',
    'Chúc người con gái {from} yêu thương nhất luôn rạng ngời như đoá hoa sớm mai, không bao giờ phải âu lo muộn phiền. Việc của {to} là chỉ cần mỉm cười thật tươi thôi nhé!',
    'Hôm nay là ngày của {to}, nhưng với {from}, ngày nào được thấy nụ cười và ánh mắt rạng rỡ của {to} cũng đều là một ngày hạnh phúc. Thương {to} thật nhiều!',
    'Chúc {to} một ngày 20/10 thật trọn vẹn: đi đâu cũng được cưng chiều, làm gì cũng suôn sẻ, và luôn nhớ rằng {from} sẽ luôn ở bên cạnh chở che cho {to}.',
    'Gửi người con gái đặc biệt nhất trong tim {from}: Chúc {to} mãi dịu dàng, xinh đẹp và luôn được nâng niu như đoá hoa quý giá nhất trần đời.',
    'Cảm ơn {to} vì đã luôn dịu dàng kiên nhẫn bên {from}. Chúc {to} ngày 20/10 nhận được thật nhiều điều bất ngờ ngọt ngào!'
  ],
  family: [
    'Nhân ngày 20/10, {from} kính chúc {to} luôn dồi dào sức khoẻ, tâm hồn an yên và mỗi ngày trôi qua đều đầy ắp tiếng cười. Cảm ơn {to} vì tất cả hy sinh thầm lặng dành cho gia đình.',
    'Gửi người phụ nữ tuyệt vời và bao dung nhất cuộc đời {from}. Chúc {to} ngày Phụ nữ Việt Nam thật hạnh phúc, bớt đi những vất vả âu lo và luôn an vui mỗi ngày!',
    'Không có món quà nào sánh bằng tình yêu thương và sự ấm áp của {to}. Chúc {to} luôn khoẻ mạnh, trẻ trung và mãi là điểm tựa bình yên nhất trong trái tim {from}.',
    'Nhân ngày 20/10, {from} chỉ mong {to} luôn khoẻ mạnh, thảnh thơi và được tận hưởng những niềm vui giản dị, ấm áp nhất bên gia đình thương yêu.'
  ],
  friend: [
    'Chúc {to} ngày 20/10 xinh đẹp rạng ngời, tiền tài rủng rỉnh, công việc hanh thông và luôn toả sáng với nụ cười tự tin nhất nhé!',
    'Chúc cô bạn tuyệt vời của {from} luôn giữ vững phong độ xinh đẹp, ăn hoài không béo, mọi kế hoạch đều thành công rực rỡ và luôn hạnh phúc!',
    'Ngày 20/10 chúc {to} ngập tràn quà cáp, hoa tươi và những lời khen có cánh. Hãy luôn tự tin, kiêu hãnh và sống trọn vẹn với đam mê của mình nhé!',
    'Chúc {to} có một ngày 20/10 thật rực rỡ, mua sắm thả ga không lo về giá và lúc nào cũng được yêu thương trân trọng!'
  ],
  sweet: [
    'Hôm nay máy đo nhan sắc thế giới thông báo: {to} đã đạt 100/100 điểm tuyệt đối! Chúc {to} 20/10 siêu hạnh phúc, luôn vui vẻ và được cưng chiều hết nấc.',
    'Thông báo đặc biệt ngày 20/10: Hôm nay {to} không được phép cau mày hay mệt mỏi, chỉ được nhận quà, ăn ngon và được {from} chiều chuộng thôi nhé!',
    'Chúc {to} ngày 20/10: Sáng thức dậy rạng rỡ, trưa ăn ngon miệng, chiều ví đầy tiền, tối ngập tràn hoa thơm và sự quan tâm ngọt ngào!',
    'Chúc {to} mãi trẻ trung, đáng yêu, mọi điều ước đều thành hiện thực và cuộc sống lúc nào cũng ngập tràn mật ngọt!'
  ]
};

/**
 * Intelligent client-side template formatter that weaves in custom notes naturally
 */
export function formatPersonalWish(
  template: string,
  to: string,
  from: string,
  customNote?: string
): string {
  const recipient = to.trim() || 'em';
  const sender = from.trim() || 'anh';
  let formatted = template.replace(/\{to\}/g, recipient).replace(/\{from\}/g, sender);

  if (customNote && customNote.trim()) {
    const note = customNote.trim();
    formatted += ` Đặc biệt, chúc ${recipient} luôn giữ trọn niềm vui với ${note} và mãi là chính mình thật hạnh phúc!`;
  }

  return formatted;
}
