USE evote_system;

-- Insert sample parties
INSERT INTO parties (name, symbol, color, is_active) VALUES
('Democratic Party', '🌟', '#1E40AF', TRUE),
('Progressive Alliance', '🌱', '#059669', TRUE),
('National Unity', '⭐', '#7C3AED', TRUE),
('Future Forward', '🚀', '#EA580C', TRUE);

-- Insert admin user
INSERT INTO users (email, username, password_hash, role, is_active) VALUES
('admin@evote.lk', 'admin', '$2b$12$LQv3c1yqBwEHxv68JaMCuOHrxVxFaFjaohAWkbLIBHI.', 'admin', TRUE);

-- Insert sample election
INSERT INTO elections (title, description, start_date, end_date, status) VALUES
('Presidential Election 2024', 'National Presidential Election for Sri Lanka', 
'2024-02-01 07:00:00', '2024-02-15 18:00:00', 'active');

-- Insert sample voters
INSERT INTO users (email, username, password_hash, role) VALUES
('john.voter@email.com', 'johnvoter', '$2b$12$sample_hash_1', 'voter'),
('maria.voter@email.com', 'mariavoter', '$2b$12$sample_hash_2', 'voter'),
('david.voter@email.com', 'davidvoter', '$2b$12$sample_hash_3', 'voter');

INSERT INTO voters (user_id, nic_number, full_name, district, is_verified) VALUES
(2, '200012345678', 'John Voter', 'Colombo', TRUE),
(3, '199587654321', 'Maria Voter', 'Kandy', TRUE),
(4, '198876543210', 'David Voter', 'Galle', TRUE);

-- Insert candidate users
INSERT INTO users (email, username, password_hash, role) VALUES
('john.silva@candidate.lk', 'johnsilva2024', '$2b$12$candidate_hash_1', 'candidate'),
('maria.fernando@candidate.lk', 'mariafernando2024', '$2b$12$candidate_hash_2', 'candidate'),
('david.perera@candidate.lk', 'davidperera2024', '$2b$12$candidate_hash_3', 'candidate'),
('sarah.jayawardena@candidate.lk', 'sarahj2024', '$2b$12$candidate_hash_4', 'candidate');

-- Insert candidates (simplified)
INSERT INTO candidates (user_id, election_id, party_id, full_name, age, profession, manifesto, id_front_image, id_back_image, selfie_image, is_approved) VALUES
(5, 1, 1, 'John Silva', 52, 'Former Finance Minister & Economist', 
'Focus on economic development, job creation, and education reform. Committed to reducing poverty and improving healthcare accessibility for all Sri Lankan citizens.',
'/uploads/candidates/john_silva_id_front.jpg', '/uploads/candidates/john_silva_id_back.jpg', '/uploads/candidates/john_silva_selfie.jpg', TRUE),

(6, 1, 2, 'Maria Fernando', 48, 'Environmental Lawyer & Human Rights Activist', 
'Champion of environmental protection and sustainable development. Advocate for women\'s rights, social justice, and inclusive economic growth that benefits all communities.',
'/uploads/candidates/maria_fernando_id_front.jpg', '/uploads/candidates/maria_fernando_id_back.jpg', '/uploads/candidates/maria_fernando_selfie.jpg', TRUE),

(7, 1, 3, 'David Perera', 59, 'Supreme Court Lawyer & Former Attorney General', 
'Unity, peace, and social justice for all citizens. Focus on reconciliation, national harmony, and building bridges between communities while ensuring equal opportunities for everyone.',
'/uploads/candidates/david_perera_id_front.jpg', '/uploads/candidates/david_perera_id_back.jpg', '/uploads/candidates/david_perera_selfie.jpg', TRUE),

(8, 1, 4, 'Sarah Jayawardena', 44, 'Tech Entrepreneur & Innovation Leader', 
'Technology innovation and youth empowerment. Building a digital-first economy for the future with focus on entrepreneurship, innovation, and preparing Sri Lanka for the digital age.',
'/uploads/candidates/sarah_jayawardena_id_front.jpg', '/uploads/candidates/sarah_jayawardena_id_back.jpg', '/uploads/candidates/sarah_jayawardena_selfie.jpg', TRUE);

-- Insert sample votes (using hashed voter IDs for anonymity)
INSERT INTO votes (election_id, candidate_id, voter_hash, district) VALUES
(1, 1, SHA2('voter_2_election_1', 256), 'Colombo'),
(1, 2, SHA2('voter_3_election_1', 256), 'Kandy'),
(1, 1, SHA2('voter_4_election_1', 256), 'Galle');
