import { Router, Request, Response } from 'express';
import { con } from '../config/database';

const router = Router();

router.post('/api/pins', (req: Request, res: Response) => {
  const { title, category, products, priceRange, description, address, lat, lng, user_id } = req.body;
  con.query(
    'INSERT INTO map_pins (title, category, products, priceRange, description, address, lat, lng, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [title, category, products, priceRange, description, address, lat, lng, user_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'DBエラー' });
      }
      res.status(201).json({ message: 'ピン追加成功' });
    }
  );
});

export default router;