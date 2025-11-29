CREATE TABLE IF NOT EXISTS sys_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(128),
    real_name VARCHAR(128),
    mobile VARCHAR(32),
    department VARCHAR(128),
    status TINYINT DEFAULT 1,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sys_role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(128) NOT NULL,
    role_code VARCHAR(128) NOT NULL UNIQUE,
    description VARCHAR(255),
    status TINYINT DEFAULT 1,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sys_permission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    permission_name VARCHAR(128) NOT NULL,
    permission_code VARCHAR(128) NOT NULL UNIQUE,
    type VARCHAR(32) NOT NULL,
    parent_id BIGINT,
    path VARCHAR(255),
    method VARCHAR(20),
    sort INT DEFAULT 0,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sys_user_role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    UNIQUE KEY uk_user_role (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS sys_role_permission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    UNIQUE KEY uk_role_permission (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS pm_product (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(128) NOT NULL,
    product_code VARCHAR(64) NOT NULL UNIQUE,
    product_type VARCHAR(64) NOT NULL,
    description TEXT,
    cover_image_url VARCHAR(512),
    origin_image_url VARCHAR(512),
    tags VARCHAR(255),
    status TINYINT DEFAULT 1,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_pm_product_type (product_type)
);

CREATE TABLE IF NOT EXISTS pm_content_template (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    template_name VARCHAR(128) NOT NULL,
    platform VARCHAR(32) NOT NULL,
    module_type VARCHAR(32) NOT NULL,
    description VARCHAR(255),
    prompt TEXT,
    tone VARCHAR(64),
    style VARCHAR(64),
    content_length VARCHAR(32),
    image_style VARCHAR(64),
    image_ratio VARCHAR(32),
    image_quantity INT,
    video_style VARCHAR(64),
    video_ratio VARCHAR(32),
    video_duration INT,
    api_vendor VARCHAR(32),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_template (template_name, platform, module_type)
);

CREATE TABLE IF NOT EXISTS pm_content_module (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    platform VARCHAR(32) NOT NULL,
    module_type VARCHAR(32) NOT NULL,
    module_title VARCHAR(128) NOT NULL,
    template_id BIGINT,
    prompt TEXT,
    tone VARCHAR(64),
    style VARCHAR(64),
    content_length VARCHAR(32),
    image_style VARCHAR(64),
    image_ratio VARCHAR(32),
    image_quantity INT,
    video_style VARCHAR(64),
    video_ratio VARCHAR(32),
    video_duration INT,
    api_vendor VARCHAR(32),
    sort_order INT DEFAULT 0,
    status VARCHAR(32) DEFAULT 'DRAFT',
    last_generated_at TIMESTAMP NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_module_product FOREIGN KEY (product_id) REFERENCES pm_product(id) ON DELETE CASCADE,
    CONSTRAINT fk_module_template FOREIGN KEY (template_id) REFERENCES pm_content_template(id) ON DELETE SET NULL,
    KEY idx_module_product (product_id),
    KEY idx_module_platform (platform)
);

CREATE TABLE IF NOT EXISTS pm_content_module_result (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    module_id BIGINT NOT NULL,
    result_type VARCHAR(32) NOT NULL,
    content TEXT,
    asset_url VARCHAR(512),
    sort_order INT DEFAULT 0,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_result_module FOREIGN KEY (module_id) REFERENCES pm_content_module(id) ON DELETE CASCADE,
    KEY idx_module_result (module_id)
);
