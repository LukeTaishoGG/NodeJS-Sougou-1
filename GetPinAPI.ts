import { Router, Request, Response } from 'express';
import { con } from './config/database';

const router = Router();

// 全マップピンを取得
router.get('/map_pins', (req: Request, res: Response) => {
  const { ne_lat, ne_lng, sw_lat, sw_lng } = req.query;
  // 境界指定がある場合は境界内のピンのみ取得
  if (ne_lat && ne_lng && sw_lat && sw_lng) {
    const sql = `
      SELECT * FROM map_pins
      WHERE latitude BETWEEN ? AND ?
      AND longitude BETWEEN ? AND ?
    `;
    con.query(sql, [sw_lat, ne_lat, sw_lng, ne_lng], (err: any, results: any) => {
      if (err) {
        return res.status(500).json({ error: 'サーバーエラー' });
      }
      res.status(200).json(results);
    });
  } else {
    // 境界指定がない場合は全件取得
    const sql = 'SELECT * FROM map_pins';
    con.query(sql, (err: any, results: any) => {
      if (err) {
        return res.status(500).json({ error: 'サーバーエラー' });
      }
      res.status(200).json(results);
    });
  }
});

// ピン名・住所で部分一致検索するサジェストAPI（:idより前に配置）
router.get('/map_pins/search', (req, res) => {
  const { query } = req.query;
  if (!query || typeof query !== 'string' || query.trim() === '') {
    return res.json([]);
  }
  const sql = `
    SELECT id, latitude, longitude, address, machine_name
    FROM map_pins
    WHERE machine_name LIKE ? OR address LIKE ?
  `;
  const likeQuery = `%${query}%`;
  con.query(sql, [likeQuery, likeQuery], (err, results) => {
    if (err) return res.status(500).json({ error: 'サーバーエラー' });
    res.json(results);
  });
});

// 特定のIDのマップピンを取得
router.get('/map_pins/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM map_pins WHERE id = ?';
  con.query(sql, [id], (err: any, results: any) => {
    if (err) {
      return res.status(500).json({ error: 'サーバーエラー' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'マップピンが見つかりません' });
    }
    res.status(200).json(results[0]);
  });
});

// 古いpinsテーブル用のAPI（後方互換性のため残す）
router.get('/pins', (req: Request, res: Response) => {
  const { pin } = req.query;
  const sql = 'SELECT * FROM pins WHERE pin = ?';
  con.query(sql, [pin], (err: any, results: any) => {
    if (err) {
      return res.status(500).json({ error: 'サーバーエラー' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'ピンが見つかりません' });
    }
    res.status(200).json(results[0]);
  });
});

export default router;