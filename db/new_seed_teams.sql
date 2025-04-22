-- Insert teams
INSERT INTO teams (id, name) VALUES 
  (gen_random_uuid(), 'ヘベウデス'),
  (gen_random_uuid(), '05ユニティーズ'),
  (gen_random_uuid(), 'TUC'),
  (gen_random_uuid(), 'いやさか2000'),
  (gen_random_uuid(), 'Undefeated'),
  (gen_random_uuid(), 'コンパネロス');

-- Insert players for ヘベウデス
INSERT INTO players (team_id, number, name, position, is_active) VALUES
  ((SELECT id FROM teams WHERE name = 'ヘベウデス'), '96', 'セグラW', 'FW', true),
  ((SELECT id FROM teams WHERE name = 'ヘベウデス'), '0', '住垣 智之', 'C', true),
  ((SELECT id FROM teams WHERE name = 'ヘベウデス'), '0', '甲斐田', 'DF', true),
  ((SELECT id FROM teams WHERE name = 'ヘベウデス'), '3', '佐藤まゆみ', 'FW', true),
  ((SELECT id FROM teams WHERE name = 'ヘベウデス'), '45', '相良真吾', 'HP', true);

-- Insert players for 05ユニティーズ
INSERT INTO players (team_id, number, name, position, is_active) VALUES
  ((SELECT id FROM teams WHERE name = '05ユニティーズ'), '10', '佐々木 瞬', 'C', true),
  ((SELECT id FROM teams WHERE name = '05ユニティーズ'), '56', '杉村 匠', 'C', true),
  ((SELECT id FROM teams WHERE name = '05ユニティーズ'), '11', '住垣 香奈子', 'FW', true),
  ((SELECT id FROM teams WHERE name = '05ユニティーズ'), '0', '安田 里奈', 'FW', true),
  ((SELECT id FROM teams WHERE name = '05ユニティーズ'), '0', '三田 直樹', 'FW', true);

-- Insert players for TUC
INSERT INTO players (team_id, number, name, position, is_active) VALUES
  ((SELECT id FROM teams WHERE name = 'TUC'), '0', '坂上 敬冶', 'FW', true),
  ((SELECT id FROM teams WHERE name = 'TUC'), '0', '篠崎 美晃', 'C', true),
  ((SELECT id FROM teams WHERE name = 'TUC'), '0', '川口 星哉', 'FW', true),
  ((SELECT id FROM teams WHERE name = 'TUC'), '0', '篠崎弘子', 'FW', true);

-- Insert players for いやさか2000
INSERT INTO players (team_id, number, name, position, is_active) VALUES
  ((SELECT id FROM teams WHERE name = 'いやさか2000'), '0', '高橋 義弘', 'C', true),
  ((SELECT id FROM teams WHERE name = 'いやさか2000'), '0', '中野 隆治', 'C', true),
  ((SELECT id FROM teams WHERE name = 'いやさか2000'), '0', '佐藤 祐子', 'FW', true);

-- Insert players for Undefeated
INSERT INTO players (team_id, number, name, position, is_active) VALUES
  ((SELECT id FROM teams WHERE name = 'Undefeated'), '0', '佐藤 豪太', 'C', true),
  ((SELECT id FROM teams WHERE name = 'Undefeated'), '0', '中野', 'C', true),
  ((SELECT id FROM teams WHERE name = 'Undefeated'), '0', '南', 'FW', true),
  ((SELECT id FROM teams WHERE name = 'Undefeated'), '0', '木村 雅直', 'DF', true),
  ((SELECT id FROM teams WHERE name = 'Undefeated'), '0', '服部 光秀', 'DF', true),
  ((SELECT id FROM teams WHERE name = 'Undefeated'), '0', '土谷 力', 'FW', true);

-- Insert players for コンパネロス
INSERT INTO players (team_id, number, name, position, is_active) VALUES
  ((SELECT id FROM teams WHERE name = 'コンパネロス'), '0', 'せいじ', 'C', true);