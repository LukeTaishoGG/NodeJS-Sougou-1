import { Router } from 'express';
import { con } from '../config/database';

const router = Router();

router.get('/vending_machines/by_pin/:pin_id', (req, res) => {
  const { pin_id } = req.params;
  const sql = `
    SELECT
      vm.id AS vending_machine_id,
      vm.pin_id,
      mp.latitude,
      mp.longitude,
      mp.address,
      vm.user_id,
      vm.manufacturer_id,
      m.name AS manufacturer_name,
      vm.category_id,
      c.name AS category_name,
      vm.price_range_id,
      p.price_range,
      vm.machine_description_id,
      md.machine_name,
      md.description,
      pr.name AS product_name
    FROM
      vending_machines vm
      LEFT JOIN map_pins mp ON vm.pin_id = mp.id
      LEFT JOIN manufacturers m ON vm.manufacturer_id = m.id
      LEFT JOIN categories c ON vm.category_id = c.id
      LEFT JOIN price_ranges p ON vm.price_range_id = p.id
      LEFT JOIN machine_descriptions md ON vm.machine_description_id = md.id
      LEFT JOIN products pr ON vm.id = pr.id
    WHERE
      vm.pin_id = ?
  `;
  con.query(sql, [pin_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'サーバーエラー' });
    }
    res.status(200).json(results);
  });
});

export default router;
