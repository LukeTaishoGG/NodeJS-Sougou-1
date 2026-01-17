import { Router, Request, Response } from 'express';
import { con } from './config/database';

const router = Router();

// サインアップAPI（Reactのfetch先に合わせて'/users'に変更）
router.post('/users', (req: Request, res: Response) => {
  const { user_id, email, password } = req.body;
  
  // 必須項目のチェック
  if (!user_id || !email || !password) {
    return res.status(400).json({ error: 'ユーザーID、メールアドレス、パスワードは必須項目です' });
  }
  
  const sql = 'INSERT INTO users (user_id, email, password) VALUES (?, ?, ?)';
  con.query(sql, [user_id, email, password], (err: any, result: any) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'ユーザーIDまたはメールアドレスが既に存在します' });
      }
      return res.status(500).json({ error: 'サーバーエラー' });
    }
    res.status(201).json({ 
      message: 'ユーザーが登録されました', 
      id: result.insertId,
      user_id,
      email 
    });
  });
});

export default router;