-- Seed users with pre-hashed passwords
-- Passwords are hashed using SHA-256 with "username:password" format
-- Password = username for each user
-- Avatar URLs are placeholders - replace with actual images

INSERT INTO users (username, password_hash, display_name, avatar_url) VALUES
  ('erik', '1576be387e9e677a351b6089e999e439b8be179d5d22f2bc8619bdcf76fe5b6b', 'Erik', '/images/erik.png'),
  ('mack', '7241bebc5cb5555ef630f68eb793854fda93fda31bdab917bfdbe960346654d7', 'Mack', '/images/mack.png'),
  ('haydn', 'a321d8ba77107e7e0f497ab25cb18bc776b2166574836a94928b03507e76cb6d', 'Haydn', '/images/haydn.png'),
  ('will', '708268c0d22e960bc42096f3113b12481643c7d4feaab54c6858f378af762e5c', 'Will', '/images/will.png');

-- Sample questions for Year in Review
INSERT INTO questions (question_text, question_type, options) VALUES
  ('What was your favorite book we read this year?', 'text', NULL),
  ('Which book surprised you the most?', 'text', NULL),
  ('Rate your overall book club experience this year (1-5)', 'rating', NULL),
  ('What genre should we explore more next year?', 'text', NULL),
  ('Which book sparked the best discussion?', 'text', NULL);

-- Books (added_by: erik=1, mack=2, haydn=3, will=4)
INSERT INTO books (title, author, added_by, status) VALUES
  ('We Were Eight Years in Power', 'Ta-Nehisi Coates', 3, 'completed'),
  ('Lamb', 'Christopher Moore', 1, 'completed'),
  ('The Fisherman', 'John Langan', 4, 'completed'),
  ('Solaris', 'Stanisław Lem', 2, 'completed'),
  ('Notes from Underground', 'Fyodor Dostoevsky', 3, 'completed'),
  ('Kitchen Confidential', 'Anthony Bourdain', 1, 'completed'),
  ('The Brief and Frightening Reign of Phil', 'George Saunders', 4, 'completed'),
  ('If on a Winter''s Night a Traveler', 'Italo Calvino', 2, 'completed'),
  ('Wuthering Heights', 'Emily Brontë', 3, 'completed'),
  ('There Is No Antimemetics Division', 'qntm', 1, 'completed');
