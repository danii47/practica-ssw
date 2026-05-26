-- Limpiamos todsa las tablas para evitar conflictos
-- Lo he dejado comentado porque me daba un error sin sentido, que creo que se daba 
-- porque no esta ligado a ninguna DB.

-- DROP TABLE IF EXISTS messages CASCADE;
-- DROP TABLE IF EXISTS participants CASCADE;
-- DROP TABLE IF EXISTS conversations CASCADE;
-- DROP TABLE IF EXISTS penalties CASCADE;
-- DROP TABLE IF EXISTS contacts CASCADE;
-- DROP TABLE IF EXISTS reviews CASCADE;
-- DROP TABLE IF EXISTS exchanges CASCADE;
-- DROP TABLE IF EXISTS activities CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;


-- ==========================================
-- 1. TABLAS DE USUARIOS Y SOCIAL
-- ==========================================

CREATE TABLE users (
    id_user CHAR(64) PRIMARY KEY, -- Hash SHA-256 inmutable 
    username VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    psw_hash CHAR(64) NOT NULL,
    name VARCHAR(15) NOT NULL,
    surnames VARCHAR(30) NOT NULL,
    description VARCHAR(100),
    location VARCHAR(100),
    country VARCHAR(15) NOT NULL,
    language VARCHAR(2) DEFAULT 'es', -- ISO 639-1 (es, en, fr...)
    born_date DATE NOT NULL,
    register_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(5) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    status BOOLEAN NOT NULL DEFAULT true,
    penalties_count INT NOT NULL DEFAULT 0
);

CREATE TABLE contacts (
    id_user CHAR(64) NOT NULL,
    friend_id_user CHAR(64) NOT NULL,
    PRIMARY KEY (id_user, friend_id_user),
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (friend_id_user) REFERENCES users(id_user) ON DELETE CASCADE,
    CONSTRAINT id_user_not_self CHECK (id_user != friend_id_user) 
);

-- ==========================================
-- 2. TABLAS DE ACTIVIDADES E INTERCAMBIOS
-- ==========================================

CREATE TABLE activities (
    id_activity SERIAL PRIMARY KEY,
    id_user CHAR(64) NOT NULL,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(250) NOT NULL,
    topic VARCHAR(15) NOT NULL,
    type VARCHAR(15) NOT NULL CHECK (type IN ('presencial', 'online')),
    date TIMESTAMP, -- Puede ser NULL si es flexible
    location VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    status VARCHAR(11) NOT NULL DEFAULT 'active' 
        CHECK (status IN ('active', 'in_progress', 'booked', 'expired')),
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

CREATE TABLE exchanges (
    id_exchange SERIAL PRIMARY KEY,
    requester_id_user CHAR(64) NOT NULL,
    target_id_user CHAR(64) NOT NULL,
    requested_activity INT NOT NULL,
    offered_activity INT NOT NULL,
    status VARCHAR(9) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'accepted', 'refused', 'completed')),
    chain_id INT DEFAULT NULL, -- NULL para intercambios directos, valor compartido para ciclos 
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_id_user) REFERENCES users(id_user),
    FOREIGN KEY (target_id_user) REFERENCES users(id_user),
    FOREIGN KEY (requested_activity) REFERENCES activities(id_activity),
    FOREIGN KEY (offered_activity) REFERENCES activities(id_activity),
    CONSTRAINT exchange_not_self CHECK (requester_id_user != target_id_user),
    CONSTRAINT activities_not_same CHECK (requested_activity != offered_activity)
);

CREATE TABLE reviews (
    id_review SERIAL PRIMARY KEY,
    written_by CHAR(64) NOT NULL,
    written_to_user CHAR(64) NOT NULL,
    id_exchange INT NOT NULL,
    content VARCHAR(250) NOT NULL,
    valoration INT NOT NULL CHECK (valoration >= 1 AND valoration <= 5),
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_flagged BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY (written_by) REFERENCES users(id_user),
    FOREIGN KEY (written_to_user) REFERENCES users(id_user),
    FOREIGN KEY (id_exchange) REFERENCES exchanges(id_exchange),
    CONSTRAINT review_not_self CHECK (written_by != written_to_user),
    CONSTRAINT one_review_per_exchange UNIQUE (written_by, id_exchange)
);

-- ==========================================
-- 3. TABLAS DE CONVERSACIONES
-- ==========================================

CREATE TABLE conversations (
    id_conversation SERIAL PRIMARY KEY,
    id_exchange INT, -- Ligado a un trueque o NULL si es chat social 
    type VARCHAR(15) NOT NULL CHECK (type IN ('group', 'direct')),
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_exchange) REFERENCES exchanges(id_exchange) ON DELETE SET NULL
);

CREATE TABLE participants (
    id_conversation INT NOT NULL,
    id_user CHAR(64) NOT NULL,
    rol VARCHAR(10) NOT NULL DEFAULT 'member' CHECK (rol IN ('member', 'admin')),
    PRIMARY KEY (id_conversation, id_user),
    FOREIGN KEY (id_conversation) REFERENCES conversations(id_conversation) ON DELETE CASCADE,
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

CREATE TABLE messages (
    id_message SERIAL PRIMARY KEY,
    id_conversation INT NOT NULL,
    id_user_sender CHAR(64) NOT NULL,
    content VARCHAR(500),
    attachment_url VARCHAR(255),
    send_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_conversation) REFERENCES conversations(id_conversation) ON DELETE CASCADE,
    FOREIGN KEY (id_user_sender) REFERENCES users(id_user),
    CONSTRAINT message_not_empty CHECK (content IS NOT NULL OR attachment_url IS NOT NULL)
);

-- ==========================================
-- 4. GESTIÓN DE SANCIONES
-- ==========================================

CREATE TABLE penalties (
    id_penalty SERIAL PRIMARY KEY,
    id_user CHAR(64) NOT NULL,
    admin_id_user CHAR(64), -- Puede ser NULL si el sistema banea automáticamente 
    id_review INT,
    id_exchange INT,
    reason VARCHAR(500) NOT NULL,
    given_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (admin_id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_review) REFERENCES reviews(id_review),
    FOREIGN KEY (id_exchange) REFERENCES exchanges(id_exchange)
);