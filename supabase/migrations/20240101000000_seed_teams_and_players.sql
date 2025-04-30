-- Seed teams table
INSERT INTO teams (name, logo_url, abbreviation) VALUES
('ヘベウデス', null, 'REB'),
('05ユニティーズ', null, '05U'),
('TUC', null, 'TUC'),
('いやさか2000', null, 'IYS'),
('Undefeated', null, 'UDF'),
('コンパネロス', null, 'CMP');

-- Seed players table for ヘベウデス
INSERT INTO players (team_id, number, name, position, is_active) VALUES
((SELECT id FROM teams WHERE name = 'ヘベウデス'), '96', 'セグラW', 'FW', true),
((SELECT id FROM teams WHERE name = 'ヘベウデス'), '0', '住垣 智之', 'C', true),
((SELECT id FROM teams WHERE name = 'ヘベウデス'), '0', '甲斐田', 'DF', true),
((SELECT id FROM teams WHERE name = 'ヘベウデス'), '3', '佐藤まゆみ', 'FW', true),
((SELECT id FROM teams WHERE name = 'ヘベウデス'), '45', '相良真吾', 'HP', true);

-- Seed players table for 05ユニティーズ
INSERT INTO players (team_id, number, name, position, is_active) VALUES
((SELECT id FROM teams WHERE name = '05ユニティーズ'), '10', '佐々木 瞬', 'C', true),
((SELECT id FROM teams WHERE name = '05ユニティーズ'), '56', '杉村 匠', 'C', true),
((SELECT id FROM teams WHERE name = '05ユニティーズ'), '11', '住垣 香奈子', 'FW', true),
((SELECT id FROM teams WHERE name = '05ユニティーズ'), '0', '安田 里奈', 'FW', true),
((SELECT id FROM teams WHERE name = '05ユニティーズ'), '0', '三田 直樹', 'FW', true);

-- Seed players table for TUC
INSERT INTO players (team_id, number, name, position, is_active) VALUES
((SELECT id FROM teams WHERE name = 'TUC'), '0', '坂上 敬冶', 'FW', true),
((SELECT id FROM teams WHERE name = 'TUC'), '0', '篠崎 美晃', 'C', true),
((SELECT id FROM teams WHERE name = 'TUC'), '0', '川口 星哉', 'FW', true),
((SELECT id FROM teams WHERE name = 'TUC'), '0', '篠崎弘子', 'FW', true);

-- Seed players table for いやさか2000
INSERT INTO players (team_id, number, name, position, is_active) VALUES
((SELECT id FROM teams WHERE name = 'いやさか2000'), '0', '高橋 義弘', 'C', true),
((SELECT id FROM teams WHERE name = 'いやさか2000'), '0', '中野 隆治', 'C', true),
((SELECT id FROM teams WHERE name = 'いやさか2000'), '0', '佐藤 祐子', 'FW', true);

-- Seed players table for Undefeated
INSERT INTO players (team_id, number, name, position, is_active) VALUES
((SELECT id FROM teams WHERE name = 'Undefeated'), '0', '佐藤 豪太', 'C', true),
((SELECT id FROM teams WHERE name = 'Undefeated'), '0', '中野', 'C', true),
((SELECT id FROM teams WHERE name = 'Undefeated'), '0', '南', 'FW', true),
((SELECT id FROM teams WHERE name = 'Undefeated'), '0', '木村 雅直', 'DF', true),
((SELECT id FROM teams WHERE name = 'Undefeated'), '0', '服部 光秀', 'DF', true),
((SELECT id FROM teams WHERE name = 'Undefeated'), '0', '土谷 力', 'FW', true);

-- Seed players table for コンパネロス
INSERT INTO players (team_id, number, name, position, is_active) VALUES
((SELECT id FROM teams WHERE name = 'コンパネロス'), '0', 'せいじ', 'C', true);

-- Initialize player_stats for all players
INSERT INTO player_stats (player_id, goals, assists, points)
SELECT id, 0, 0, 0 FROM players;