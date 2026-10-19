import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const FALLBACK_TEMPLATES: Record<string, string[]> = {
  romantic: [
    'Chúc {to} ngày 20/10 thật ngập tràn niềm vui, nhiều hoa và quà. Cảm ơn vì đã đến và làm thế giới của {from} trở nên ấm áp, ngọt ngào hơn mỗi ngày.',
    'Chúc người con gái anh yêu luôn rạng ngời như đoá hoa sớm mai, không bao giờ phải buồn phiền hay âu lo. Việc của {to} chỉ là mỉm cười thật tươi thôi nhé!',
    'Hôm nay là ngày của {to}, nhưng với {from}, ngày nào được thấy nụ cười của {to} cũng đều là ngày lễ đặc biệt. Yêu và thương {to} thật nhiều!',
    'Chúc {to} một ngày 20/10 thật trọn vẹn: đi đâu cũng được cưng chiều, làm gì cũng suôn sẻ, và luôn nhớ rằng ở phía sau luôn có {from} chở che.'
  ],
  family: [
    'Nhân ngày 20/10, {from} kính chúc {to} luôn dồi dào sức khoẻ, tâm hồn an yên và mỗi ngày trôi qua đều đầy ắp tiếng cười. Cảm ơn {to} vì tất cả hy sinh thầm lặng dành cho gia đình.',
    'Gửi người phụ nữ tuyệt vời nhất cuộc đời {from}. Chúc {to} ngày Phụ nữ Việt Nam thật hạnh phúc, bớt đi những âu lo và luôn sống an vui bên con cháu!',
    'Không có món quà nào sánh bằng tình yêu thương của {to}. Chúc {to} luôn khoẻ mạnh, trẻ trung và mãi là điểm tựa bình yên nhất trong trái tim {from}.'
  ],
  friend: [
    'Chúc {to} ngày 20/10 xinh đẹp rạng ngời, tiền tài rủng rỉnh, công việc hanh thông và luôn toả sáng như công chúa nhé!',
    'Chúc cô bạn tuyệt vời của {from} luôn giữ vững phong độ xinh đẹp, ăn hoài không béo, deadline tự trôi và mỗi ngày đều có thật nhiều niềm vui bất ngờ!',
    'Ngày 20/10 chúc {to} ngập tràn quà cáp, hoa tươi và những lời khen có cánh. Hãy luôn tự tin, toả sáng và hạnh phúc theo cách riêng của mình!'
  ],
  sweet: [
    'Hôm nay máy đo nhan sắc thế giới báo cáo: {to} đã đạt điểm tối đa! Chúc {to} 20/10 siêu hạnh phúc, luôn vui vẻ và được yêu thương vô điều kiện.',
    'Thông báo ngày 20/10: {to} không được phép làm việc quá sức hay cau mày, chỉ được nhận quà, ăn ngon và được cưng chiều thôi nhé!',
    'Chúc {to} 20/10: Sáng thức dậy rạng rỡ, trưa ăn ngon miệng, chiều ví đầy tiền, tối ngập tràn yêu thương từ {from}!'
  ]
};

function getFallbackWish(to: string, from: string, topic: string): string {
  const list = FALLBACK_TEMPLATES[topic] || Object.values(FALLBACK_TEMPLATES).flat();
  const raw = list[Math.floor(Math.random() * list.length)];
  return raw.replace(/\{to\}/g, to).replace(/\{from\}/g, from);
}

// API endpoint to generate personal 20/10 wishes
app.post('/api/generate-wish', async (req, res) => {
  const {
    recipient = 'người thương',
    sender = 'người gửi',
    topic = 'all',
    customPrompt = '',
  } = req.body;

  const topicDescriptions: Record<string, string> = {
    all: 'chân thành, đong đầy yêu thương, ấm áp và ý nghĩa',
    romantic: 'dành cho người yêu / vợ: lãng mạn, ngọt ngào, cưng chiều, tình cảm sâu đậm',
    family: 'dành cho Mẹ / người thân lớn tuổi: hiếu thảo, biết ơn, kính yêu, chúc sức khỏe và bình an',
    friend: 'dành cho bạn bè, đồng nghiệp nữ: tươi vui, tích cực, rạng rỡ, thành công và hạnh phúc',
    sweet: 'hóm hỉnh, đáng yêu, ngọt ngào, khen ngợi nhan sắc và nụ cười rạng rỡ',
  };

  const topicContext = topicDescriptions[topic] || topicDescriptions.all;

  const prompt = `Bạn là một nhà sáng tác lời chúc tài hoa và tinh tế.
Hãy viết một lời chúc mừng ngày Phụ nữ Việt Nam 20/10 DÀNH RIÊNG CHO CÁ NHÂN (1-kèm-1, từ một người gửi tới một người nhận cụ thể, KHÔNG PHẢI tập thể/công ty/tổ chức).

Thông tin chi tiết:
- Người nhận (To): ${recipient}
- Người gửi (From): ${sender}
- Phong cách & Chủ đề: ${topicContext}
${customPrompt ? `- Yêu cầu / chi tiết riêng bổ sung: ${customPrompt}` : ''}

Yêu cầu định dạng:
- Xưng hô chuẩn xác, tự nhiên giữa ${sender} và ${recipient} (ví dụ: anh - em, con - mẹ, mình - bạn...).
- Câu văn tinh tế, chạm đến cảm xúc, dài khoảng 2-3 câu (tối đa 60 từ).
- Tuyệt đối KHÔNG nhắc đến công ty, phòng ban, tập thể. Đây là tấm thiệp tình cảm riêng tư giữa 2 cá nhân.
- Chỉ trả về đúng nội dung câu chúc, không thêm dấu ngoặc kép, không mở đầu bằng tiêu đề, không ghi chữ ký ở cuối.`;

  const models = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-3.1-flash-lite'];

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      const wishText = response.text?.trim();
      if (wishText) {
        return res.json({ wish: wishText, source: 'gemini', model });
      }
    } catch (err: any) {
      console.warn(`Attempt with ${model} failed:`, err?.message || err);
    }
  }

  // Gracefully return personalized fallback wish so frontend never fails
  const fallbackWish = getFallbackWish(recipient, sender, topic);
  res.json({
    wish: fallbackWish,
    source: 'preset',
    fallback: true
  });
});

// Setup Vite middlewares in development or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const portNumber = Number(PORT) || 3000;
  app.listen(portNumber, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${portNumber}`);
  });
}

startServer();
