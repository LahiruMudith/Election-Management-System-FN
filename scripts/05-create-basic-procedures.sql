USE evote_system;

DELIMITER //

-- Procedure to cast a vote
CREATE PROCEDURE CastVote(
    IN p_election_id INT,
    IN p_candidate_id INT,
    IN p_voter_id INT
)
BEGIN
    DECLARE v_voter_hash VARCHAR(64);
    DECLARE v_district VARCHAR(100);
    DECLARE v_already_voted BOOLEAN DEFAULT FALSE;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Get voter district
    SELECT district INTO v_district
    FROM voters 
    WHERE user_id = p_voter_id AND is_verified = TRUE;
    
    IF v_district IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Voter not found or not verified';
    END IF;
    
    -- Create voter hash for anonymity
    SET v_voter_hash = SHA2(CONCAT(p_voter_id, '_election_', p_election_id), 256);
    
    -- Check if already voted
    SELECT COUNT(*) > 0 INTO v_already_voted
    FROM votes 
    WHERE election_id = p_election_id AND voter_hash = v_voter_hash;
    
    IF v_already_voted THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Voter has already voted in this election';
    END IF;
    
    -- Insert vote
    INSERT INTO votes (election_id, candidate_id, voter_hash, district)
    VALUES (p_election_id, p_candidate_id, v_voter_hash, v_district);
    
    COMMIT;
    
    SELECT 'Vote cast successfully' as message;
END //

-- Procedure to verify voter
CREATE PROCEDURE VerifyVoter(
    IN p_voter_id INT
)
BEGIN
    UPDATE voters 
    SET is_verified = TRUE 
    WHERE id = p_voter_id;
    
    SELECT 'Voter verified successfully' as message;
END //

DELIMITER ;
