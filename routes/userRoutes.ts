import { Router, Request, Response } from 'express';
import { con } from '../config/database';

const router = Router();

// ユーザー一覧取得API
router.get('/users', (req: Request, res: Response) => {
  const sql = 'SELECT id, user_id, email, created_at FROM users ORDER BY created_at DESC';
  con.query(sql, (err: any, result: any) => {
    if (err) {
      return res.status(500).json({ error: 'サーバーエラー' });
    }
    res.json(result);
  });
});

export default router;