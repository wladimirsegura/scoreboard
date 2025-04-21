-- Insert teams
INSERT INTO teams (id, name) VALUES 
  ('1', 'ヘベウデス'),
  ('2', '05ユニティーズ'),
  ('3', 'TUC'),
  ('4', 'いやさか2000'),
  ('5', 'Undefeated'),
  ('6', 'コンパネロス');

-- Insert players for ヘベウデス
INSERT INTO players (team_id, number, name, position, is_active) VALUES
  ('1', '96', 'セグラW', 'FW', true),
  ('1', '0', '住垣 智之', 'C', true),
  ('1', '0', '甲斐田', 'DF', true),
  ('1', '3', '佐藤まゆみ', 'FW', true),
  ('1', '45', '相良真吾', 'HP', true);

-- Insert players for 05ユニティーズ
INSERT INTO players (team_id, number, name, position, is_active) VALUES
  ('2', '10', '佐々木 瞬', 'C', true),
  ('2', '56', '杉村 匠', 'C', true),
  ('2', '11', '住垣 香奈子', 'FW', true),
  ('2', '0', '安田 里奈', 'FW', true),
  ('2', '0', '三田 直樹', 'FW', true);

-- Insert players for TUC
INSERT INTO players (team_id, number, name, position, is_active) VALUES
  ('3', '0', '坂上 敬冶', 'FW', true),
  ('3', '0', '篠崎 美晃', 'C', true),
  ('3', '0', '川口 星哉', 'FW', true),
  ('3', '0', '篠崎弘子', 'FW', true);

-- Insert players for いやさか2000
INSERT INTO players (team_id, number, name, position, is_active) VALUES
  ('4', '0', '高橋 義弘', 'C', true),
  ('4', '0', '中野 隆治', 'C', true),
  ('4', '0', '佐藤 祐子', 'FW', true);

-- Insert players for Undefeated
INSERT INTO players (team_id, number, name, position, is_active) VALUES
  ('5', '0', '佐藤 豪太', 'C', true),
  ('5', '0', '中野', 'C', true),
  ('5', '0', '南', 'FW', true),
  ('5', '0', '木村 雅直', 'DF', true),
  ('5', '0', '服部 光秀', 'DF', true),
  ('5', '0', '土谷 力', 'FW', true);

-- Insert players for コンパネロス
INSERT INTO players (team_id, number, name, position, is_active) VALUES
  ('6', '0', 'せいじ', 'C', true);