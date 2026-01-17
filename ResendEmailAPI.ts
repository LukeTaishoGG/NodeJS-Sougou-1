import { Router, Request, Response } from 'express';
import { Resend } from 'resend';

const router = Router();

// Resendクライアントの初期化
const resend = new Resend(process.env.RESEND_API_KEY || 'your-resend-api-key');

// 認証コードを保存するための一時的なストレージ（本番ではRedis等を使用）
const verificationCodes = new Map<string, { code: string, expires: number }>();

// 認証コード生成
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// メール認証コード送信
router.post('/send-verification', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'メールアドレスが必要です' });
  }

  try {
    // 認証コード生成
    const verificationCode = generateVerificationCode();

    // 認証コードを保存（5分間有効）
    verificationCodes.set(email, {
      code: verificationCode,
      expires: Date.now() + 5 * 60 * 1000 // 5分
    });

    // メール送信
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Resendのデフォルト送信者（本番では独自ドメインを使用）
      to: [email],
      subject: 'メール認証コード',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">メール認証コード</h2>
          <p>以下の認証コードを入力してください：</p>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 2em; margin: 0;">${verificationCode}</h1>
          </div>
          <p style="color: #666; font-size: 14px;">このコードは5分間有効です。</p>
        </div>
      `
    });

    if (error) {
      console.error('Resend送信エラー:', error);
      return res.status(500).json({ error: 'メール送信に失敗しました' });
    }

    res.status(200).json({
      message: '認証コードを送信しました',
      email: email
    });

  } catch (error) {
    console.error('メール送信エラー:', error);
    res.status(500).json({ error: 'メール送信に失敗しました' });
  }
});

// 認証コード確認
router.post('/verify-code', (req: Request, res: Response) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: 'メールアドレスと認証コードが必要です' });
  }

  const storedData = verificationCodes.get(email);
  
  if (!storedData) {
    return res.status(400).json({ error: '認証コードが見つかりません' });
  }

  if (Date.now() > storedData.expires) {
    verificationCodes.delete(email);
    return res.status(400).json({ error: '認証コードの有効期限が切れています' });
  }

  if (storedData.code !== code) {
    return res.status(400).json({ error: '認証コードが正しくありません' });
  }

  // 認証成功
  verificationCodes.delete(email);
  res.status(200).json({
    message: 'メール認証が完了しました',
    verified: true
  });
});
export default router;