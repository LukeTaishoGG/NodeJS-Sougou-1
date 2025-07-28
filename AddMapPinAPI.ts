import { Router, Request, Response } from 'express';
import { con } from './config/database';

const router = Router();

router.post('/map_pins', (req: Request, res: Response) => {
  const { latitude, longitude, address, machine_name } = req.body;

  const sql = 'INSERT INTO map_pins (latitude, longitude, address, machine_name) VALUES (?, ?, ?, ?)';
  con.query(sql, [latitude, longitude, address, machine_name], (err: any, result: any) => {
    if (err) {
      return res.status(500).json({ error: 'サーバーエラー' });
    }
    res.status(201).json({
      message: 'ピンが登録されました',
      id: result.insertId,
      latitude,
      longitude,
      address,
      machine_name
    });
  });
});

export default router;