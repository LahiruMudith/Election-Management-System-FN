USE evote_system;

-- View for election results
CREATE VIEW election_results AS
SELECT 
    e.id as election_id,
    e.title as election_title,
    c.id as candidate_id,
    c.full_name as candidate_name,
    p.name as party_name,
    p.symbol as party_symbol,
    COUNT(v.id) as vote_count,
    ROUND(
        (COUNT(v.id) * 100.0 / 
         (SELECT COUNT(*) FROM votes WHERE election_id = e.id)
        ), 2
    ) as vote_percentage
FROM elections e
JOIN candidates c ON e.id = c.election_id
LEFT JOIN parties p ON c.party_id = p.id
LEFT JOIN votes v ON c.id = v.candidate_id
WHERE c.is_approved = TRUE
GROUP BY e.id, c.id
ORDER BY vote_count DESC;

-- View for voter statistics
CREATE VIEW voter_stats AS
SELECT 
    district,
    COUNT(*) as total_voters,
    COUNT(CASE WHEN is_verified = TRUE THEN 1 END) as verified_voters,
    ROUND(
        (COUNT(CASE WHEN is_verified = TRUE THEN 1 END) * 100.0 / COUNT(*)), 2
    ) as verification_rate
FROM voters
GROUP BY district;

-- View for active elections
CREATE VIEW active_elections AS
SELECT 
    e.*,
    COUNT(c.id) as candidate_count,
    COUNT(v.id) as total_votes
FROM elections e
LEFT JOIN candidates c ON e.id = c.election_id AND c.is_approved = TRUE
LEFT JOIN votes v ON e.id = v.election_id
WHERE e.status = 'active' 
  AND NOW() BETWEEN e.start_date AND e.end_date
GROUP BY e.id;
