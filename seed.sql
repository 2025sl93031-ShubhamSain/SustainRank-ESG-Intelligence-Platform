-- =============================================================================
-- SustainRank — Demo Seed Data
-- =============================================================================
-- Populates the database with demo users for local development and testing.
--
-- All demo accounts share the password:  demo123
-- The testuser account uses password:    test123
--
-- Run after the Spring Boot app has started at least once
-- (Hibernate creates the tables on first boot via ddl-auto=update):
--
--   psql -U <your_user> -d sustainability_db -f seed.sql
-- =============================================================================

-- BCrypt hash for "demo123" (cost 10)
-- BCrypt hash for "test123" (cost 12)

-- ── Users ─────────────────────────────────────────────────────────────────────
INSERT INTO app_user (username, email, password, created_at) VALUES
  ('testuser',        'test@acme.com',              '$2b$12$vx0GRdqN2LCta93duJNT9uj5raUj.nfHJiw9knzGyHuUVChBe1l0q', NOW() - INTERVAL '1 day'),
  ('ironcore_mfg',    'esg@ironcore.example.com',   '$2b$10$I/uTpm4gxSqyEXW8xR65e.uG2DdsBINQJ7TugiaPfArUyYz/SahhG', NOW() - INTERVAL '120 days'),
  ('nexasoft_esg',    'sustain@nexasoft.example.com','$2b$10$I/uTpm4gxSqyEXW8xR65e.uG2DdsBINQJ7TugiaPfArUyYz/SahhG', NOW() - INTERVAL '110 days'),
  ('verdex_green',    'green@verdex.example.com',   '$2b$10$I/uTpm4gxSqyEXW8xR65e.uG2DdsBINQJ7TugiaPfArUyYz/SahhG', NOW() - INTERVAL '100 days'),
  ('axiom_sustain',   'esg@axiom.example.com',      '$2b$10$I/uTpm4gxSqyEXW8xR65e.uG2DdsBINQJ7TugiaPfArUyYz/SahhG', NOW() - INTERVAL '95 days'),
  ('petranova_esg',   'sustain@petranova.example.com','$2b$10$I/uTpm4gxSqyEXW8xR65e.uG2DdsBINQJ7TugiaPfArUyYz/SahhG', NOW() - INTERVAL '90 days'),
  ('quantum_tech',    'esg@quantumtech.example.com','$2b$10$I/uTpm4gxSqyEXW8xR65e.uG2DdsBINQJ7TugiaPfArUyYz/SahhG', NOW() - INTERVAL '85 days'),
  ('medzara_health',  'green@medzara.example.com',  '$2b$10$I/uTpm4gxSqyEXW8xR65e.uG2DdsBINQJ7TugiaPfArUyYz/SahhG', NOW() - INTERVAL '80 days'),
  ('circletrade',     'esg@circletrade.example.com','$2b$10$I/uTpm4gxSqyEXW8xR65e.uG2DdsBINQJ7TugiaPfArUyYz/SahhG', NOW() - INTERVAL '75 days'),
  ('velodrive_auto',  'sustain@velodrive.example.com','$2b$10$I/uTpm4gxSqyEXW8xR65e.uG2DdsBINQJ7TugiaPfArUyYz/SahhG', NOW() - INTERVAL '70 days'),
  ('crestbank',       'esg@crestbank.example.com',  '$2b$10$I/uTpm4gxSqyEXW8xR65e.uG2DdsBINQJ7TugiaPfArUyYz/SahhG', NOW() - INTERVAL '65 days')
ON CONFLICT (username) DO NOTHING;

-- ── Sustainability Profiles ───────────────────────────────────────────────────
INSERT INTO sustainability_profile
  (user_id, company_name, industry, num_employees,
   carbon_score, carbon_intensity,
   energy_total, electricity_kwh, electricity_usage, gas_consumption, renewable_pct, energy_intensity,
   total_waste, recycled_waste, composted_waste, waste_diversion_rate, waste_reduction_rate,
   eevta_score, tech_voc_percentage, total_students,
   environmental_score, social_score, sustainability_score,
   roi, cost_benefit, created_at, updated_at)
SELECT
  u.id, v.company_name, v.industry, v.num_employees,
  v.carbon_score, v.carbon_intensity,
  v.energy_total, v.electricity_kwh, v.electricity_usage, v.gas_consumption, v.renewable_pct, v.energy_intensity,
  v.total_waste, v.recycled_waste, v.composted_waste, v.waste_diversion_rate, v.waste_reduction_rate,
  v.eevta_score, v.tech_voc_pct, v.total_students,
  v.env_score, v.social_score, v.sustain_score,
  v.roi, v.cost_benefit,
  NOW() - (v.days_ago || ' days')::interval, NOW()
FROM (VALUES
  --  username            company_name               industry       emp    c_score c_int   e_total  e_kwh    e_usage  gas     renew  e_int  t_waste recycled compost diversion reduction eevta  tech_voc students env    social sustain  roi    cbr  days
  ('testuser',        'Shubham Industries',      'it',            50,    51.27,  1.025,  9271,    8000,    5000,    100,    30.0,  185.4, 450,    150,     80,     51.1,     51.1,     90.7,  45.0,    100,    56.43, 90.7,  61.03,   412.58, 4.13, 1),
  ('ironcore_mfg',    'IronCore Manufacturing',  'manufacturing', 65000, 38.2,   14.8,   780000,  620000,  620000,  85000,  18.0,  12.0,  48000,  18000,   3200,   44.2,     12.5,     61.4,  42.0,    5200,   41.5,  65.0,  48.8,    14.2,   2.1,  90),
  ('nexasoft_esg',    'NexaSoft Ltd',            'it',            335000,79.5,   0.9,    310000,  295000,  295000,  8000,   52.0,  0.9,   8200,   5900,    820,    81.9,     28.0,     88.2,  78.0,    42000,  83.1,  89.5,  85.7,    31.5,   6.8,  85),
  ('verdex_green',    'Verdex Technologies',     'it',            250000,76.8,   1.0,    285000,  270000,  270000,  9500,   47.0,  1.1,   7500,   5200,    700,    78.7,     25.0,     84.6,  72.0,    38000,  79.8,  86.2,  82.4,    28.7,   6.2,  80),
  ('axiom_sustain',   'Axiom Group',             'manufacturing', 42000, 51.3,   9.2,    520000,  430000,  430000,  56000,  31.0,  9.8,   32000,  15000,   2100,   53.4,     18.0,     72.5,  58.0,    3800,   55.2,  74.8,  62.9,    19.8,   3.4,  75),
  ('petranova_esg',   'Petranova Industries',    'manufacturing', 236000,29.7,   18.2,   1250000, 980000,  980000,  185000, 12.0,  14.5,  95000,  28000,   4500,   34.2,     8.0,      58.3,  35.0,    12000,  34.6,  61.4,  44.5,    22.1,   2.8,  70),
  ('quantum_tech',    'Quantum Technologies',    'it',            225000,74.1,   1.1,    268000,  252000,  252000,  10200,  44.0,  1.2,   6900,   4800,    620,    79.4,     22.0,     82.9,  68.0,    35000,  77.2,  84.0,  79.9,    26.4,   5.9,  65),
  ('medzara_health',  'Medzara Healthcare',      'healthcare',    72000, 55.6,   4.1,    390000,  360000,  360000,  22000,  28.0,  5.4,   18500,  6800,    1200,   43.2,     14.0,     69.8,  52.0,    6500,   56.8,  71.5,  62.3,    17.6,   3.1,  60),
  ('circletrade',     'CircleTrade Corp',        'retail',        36000, 62.4,   2.8,    185000,  162000,  162000,  14500,  38.0,  5.1,   12800,  7200,    1800,   70.3,     32.0,     78.1,  65.0,    3200,   68.5,  79.3,  72.6,    24.3,   4.7,  55),
  ('velodrive_auto',  'Velodrive Automotive',    'manufacturing', 12500, 48.9,   8.1,    145000,  122000,  122000,  14800,  26.0,  8.8,   14200,  6400,    980,    51.3,     16.0,     67.2,  51.0,    1800,   51.8,  69.4,  58.7,    16.9,   2.9,  50),
  ('crestbank',       'CrestBank Financial',     'finance',       185000,82.3,   0.6,    195000,  188000,  188000,  4200,   55.0,  1.1,   4800,   3800,    540,    88.9,     35.0,     85.7,  74.0,    24000,  84.1,  87.2,  85.3,    29.8,   7.2,  45)
) AS v(username, company_name, industry, num_employees,
       carbon_score, carbon_intensity,
       energy_total, electricity_kwh, electricity_usage, gas_consumption, renewable_pct, energy_intensity,
       total_waste, recycled_waste, composted_waste, waste_diversion_rate, waste_reduction_rate,
       eevta_score, tech_voc_pct, total_students,
       env_score, social_score, sustain_score, roi, cost_benefit, days_ago)
JOIN app_user u ON u.username = v.username
ON CONFLICT DO NOTHING;

-- ── Calculation History (2 entries per company — older baseline + recent) ─────
INSERT INTO calculation_history
  (user_id, profile_id,
   carbon_emissions, energy_consumption, waste_production, eevta_score,
   environmental_score, social_score, sustainability_score,
   roi, cost_benefit, investment, revenue, costs,
   created_at, updated_at)
SELECT
  u.id, sp.id,
  v.carbon_em, v.energy_con, v.waste_prod, v.eevta,
  v.env, v.social, v.sustain,
  v.roi, v.cbr, v.investment, v.revenue, v.costs,
  NOW() - (v.days_ago || ' days')::interval,
  NOW() - (v.days_ago || ' days')::interval
FROM (VALUES
  -- testuser — single history entry
  ('testuser',         51.27,   9271.0,   450.0,  90.7, 56.43, 90.7, 61.03, 412.58, 4.13,  500000.0,  5000000.0,  3000000.0, 1),
  -- dummy companies — older entry (slightly worse performance)
  ('ironcore_mfg',    58000.0, 810000.0, 50000.0, 59.0, 39.5,  63.0, 46.2,  12.8,  1.9,  2800000.0,  6100000.0, 3200000.0, 88),
  ('nexasoft_esg',     3100.0, 325000.0,  8600.0, 85.0, 80.5,  87.5, 83.1,  29.0,  6.4,  1500000.0,  5800000.0,  900000.0, 83),
  ('verdex_green',     3600.0, 298000.0,  7900.0, 81.0, 76.9,  83.8, 79.5,  26.2,  5.8,  1200000.0,  4800000.0,  750000.0, 78),
  ('axiom_sustain',   41000.0, 545000.0, 34500.0, 69.0, 52.1,  72.4, 59.8,  17.5,  3.0,  2000000.0,  5200000.0, 2300000.0, 73),
  ('petranova_esg',  118000.0,1310000.0, 99000.0, 55.0, 31.8,  59.2, 41.8,  19.9,  2.5,  5500000.0, 18000000.0, 7200000.0, 68),
  ('quantum_tech',     3900.0, 281000.0,  7200.0, 79.0, 74.5,  81.6, 77.1,  24.0,  5.5,  1100000.0,  4400000.0,  680000.0, 63),
  ('medzara_health',  21000.0, 408000.0, 19500.0, 66.0, 53.9,  69.0, 59.1,  15.8,  2.8,  1800000.0,  4200000.0, 2100000.0, 58),
  ('circletrade',      8800.0, 195000.0, 13500.0, 74.0, 65.2,  76.8, 69.4,  22.0,  4.3,   950000.0,  3100000.0, 1050000.0, 53),
  ('velodrive_auto',  13200.0, 152000.0, 15100.0, 63.0, 49.0,  66.8, 55.5,  14.9,  2.6,  1100000.0,  2800000.0, 1300000.0, 48),
  ('crestbank',        1900.0, 203000.0,  5100.0, 82.0, 81.4,  84.8, 82.6,  27.5,  6.8,   900000.0,  3600000.0,  520000.0, 43),
  -- dummy companies — recent entry (current / improved values)
  ('ironcore_mfg',    54200.0, 780000.0, 48000.0, 61.4, 41.5,  65.0, 48.8,  14.2,  2.1,  3000000.0,  6500000.0, 3100000.0, 20),
  ('nexasoft_esg',     2880.0, 310000.0,  8200.0, 88.2, 83.1,  89.5, 85.7,  31.5,  6.8,  1600000.0,  6200000.0,  880000.0, 18),
  ('verdex_green',     3200.0, 285000.0,  7500.0, 84.6, 79.8,  86.2, 82.4,  28.7,  6.2,  1300000.0,  5100000.0,  720000.0, 16),
  ('axiom_sustain',   38600.0, 520000.0, 32000.0, 72.5, 55.2,  74.8, 62.9,  19.8,  3.4,  2100000.0,  5500000.0, 2200000.0, 14),
  ('petranova_esg',  109000.0,1250000.0, 95000.0, 58.3, 34.6,  61.4, 44.5,  22.1,  2.8,  5800000.0, 19200000.0, 7000000.0, 12),
  ('quantum_tech',     3500.0, 268000.0,  6900.0, 82.9, 77.2,  84.0, 79.9,  26.4,  5.9,  1150000.0,  4700000.0,  650000.0, 10),
  ('medzara_health',  19800.0, 390000.0, 18500.0, 69.8, 56.8,  71.5, 62.3,  17.6,  3.1,  1900000.0,  4500000.0, 2000000.0,  8),
  ('circletrade',      8200.0, 185000.0, 12800.0, 78.1, 68.5,  79.3, 72.6,  24.3,  4.7,  1000000.0,  3300000.0,  980000.0,  6),
  ('velodrive_auto',  12400.0, 145000.0, 14200.0, 67.2, 51.8,  69.4, 58.7,  16.9,  2.9,  1150000.0,  2950000.0, 1250000.0,  5),
  ('crestbank',        1720.0, 195000.0,  4800.0, 85.7, 84.1,  87.2, 85.3,  29.8,  7.2,   950000.0,  3800000.0,  500000.0,  4)
) AS v(username, carbon_em, energy_con, waste_prod, eevta, env, social, sustain, roi, cbr, investment, revenue, costs, days_ago)
JOIN app_user u ON u.username = v.username
JOIN sustainability_profile sp ON sp.user_id = u.id;
