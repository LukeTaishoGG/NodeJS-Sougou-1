import { Router, Request, Response } from 'express';
import { con } from './config/database';

const router = Router();

// ログインAPI
router.post('/login', (req: Request, res: Response) => {
  const { user_id_or_email, password } = req.body;
  if (!user_id_or_email || !password) {
    return res.status(400).json({ error: 'ユーザーID/メールアドレスとパスワードが必要です' });
  }
  // ユーザーIDまたはメールアドレスでユーザーを検索
  const sql = 'SELECT * FROM users WHERE user_id = ? OR email = ?';
  con.query(sql, [user_id_or_email, user_id_or_email], (err: any, results: any) => {
    if (err) {
      return res.status(500).json({ error: 'サーバーエラー' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'ユーザーが見つかりません' });
    }
    const user = results[0];
    if (user.password !== password) {
      return res.status(401).json({ error: 'パスワードが正しくありません' });
    }
    // ログイン成功
    res.status(200).json({
      message: 'ログイン成功',
      user: {
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        name: user.user_id
      }
    });
  });
});

export default router;
