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
    api_name VARCHAR(128),
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
    api_name VARCHAR(128),
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
    content MEDIUMTEXT,
    asset_url MEDIUMTEXT,
    sort_order INT DEFAULT 0,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_result_module FOREIGN KEY (module_id) REFERENCES pm_content_module(id) ON DELETE CASCADE,
    KEY idx_module_result (module_id)
);

CREATE TABLE IF NOT EXISTS pm_prompt (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    prompt_name VARCHAR(128) NOT NULL,
    prompt_content TEXT NOT NULL,
    prompt_type VARCHAR(32) NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_prompt_type (prompt_type),
    KEY idx_prompt_name (prompt_name)
);

CREATE TABLE IF NOT EXISTS sys_llm_provider (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    provider_code VARCHAR(64) NOT NULL UNIQUE,
    provider_name VARCHAR(128) NOT NULL,
    provider_type VARCHAR(32) NOT NULL,
    vendor VARCHAR(32) COMMENT '厂商: GOOGLE, DOUBAO, MINIMAX, OPENAI, KIMI, QWEN, GLM',
    model_name VARCHAR(128),
    base_url VARCHAR(255),
    api_key MEDIUMTEXT,
    api_version VARCHAR(64),
    status TINYINT DEFAULT 1,
    default_flag TINYINT DEFAULT 0,
    concurrency_limit INT DEFAULT 5,
    timeout_seconds INT DEFAULT 30,
    capability_tags VARCHAR(255),
    description VARCHAR(512),
    metadata TEXT,
    last_synced_at TIMESTAMP NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_llm_provider_status (status)
);

CREATE TABLE IF NOT EXISTS sys_llm_model_param_template (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    vendor VARCHAR(32) NOT NULL,
    generation_type VARCHAR(32) NOT NULL,
    param_key VARCHAR(64) NOT NULL,
    param_label VARCHAR(128) NOT NULL,
    input_type VARCHAR(32) NOT NULL,
    required TINYINT DEFAULT 0,
    placeholder VARCHAR(255),
    default_value VARCHAR(255),
    options TEXT,
    description VARCHAR(255),
    sort_order INT DEFAULT 0,
    status TINYINT DEFAULT 1,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_param_template (vendor, generation_type, param_key),
    KEY idx_param_template_status (status)
);

CREATE TABLE IF NOT EXISTS sys_llm_provider_param (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    provider_id BIGINT NOT NULL,
    param_key VARCHAR(64) NOT NULL,
    param_value VARCHAR(512),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_provider_param_provider FOREIGN KEY (provider_id) REFERENCES sys_llm_provider(id) ON DELETE CASCADE,
    UNIQUE KEY uk_provider_param (provider_id, param_key)
);

CREATE TABLE IF NOT EXISTS sys_reasoning_thread (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    thread_name VARCHAR(128) NOT NULL,
    thread_identifier VARCHAR(128),
    provider_code VARCHAR(64),
    model_name VARCHAR(128),
    status VARCHAR(32) NOT NULL,
    message_count INT DEFAULT 0,
    input_tokens INT DEFAULT 0,
    output_tokens INT DEFAULT 0,
    latency_millis INT DEFAULT 0,
    error_message VARCHAR(512),
    metadata TEXT,
    last_activity_time TIMESTAMP NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_reasoning_thread_status (status),
    KEY idx_reasoning_thread_identifier (thread_identifier)
);

CREATE TABLE IF NOT EXISTS sys_reasoning_thread_message (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    thread_id BIGINT NOT NULL,
    role VARCHAR(32) NOT NULL,
    content MEDIUMTEXT,
    token_usage INT DEFAULT 0,
    latency_millis INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reasoning_message_thread FOREIGN KEY (thread_id) REFERENCES sys_reasoning_thread(id) ON DELETE CASCADE,
    KEY idx_reasoning_message_thread (thread_id)
);

CREATE TABLE IF NOT EXISTS sys_model_comparison (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    comparison_name VARCHAR(128) NOT NULL,
    prompt TEXT NOT NULL,
    provider_a VARCHAR(64),
    model_a VARCHAR(128),
    provider_b VARCHAR(64),
    model_b VARCHAR(128),
    evaluation_criteria TEXT,
    status VARCHAR(32) NOT NULL,
    result_a MEDIUMTEXT,
    result_b MEDIUMTEXT,
    score_a DECIMAL(5,2),
    score_b DECIMAL(5,2),
    verdict VARCHAR(32),
    winner VARCHAR(64),
    evaluation_notes MEDIUMTEXT,
    latency_a INT DEFAULT 0,
    latency_b INT DEFAULT 0,
    input_tokens_a INT DEFAULT 0,
    input_tokens_b INT DEFAULT 0,
    output_tokens_a INT DEFAULT 0,
    output_tokens_b INT DEFAULT 0,
    created_by VARCHAR(64),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_model_comparison_status (status)
);
