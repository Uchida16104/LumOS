use serde::{Deserialize, Serialize};
use sqlx::{PgPool, postgres::PgPoolOptions};

#[derive(Debug, Serialize, Deserialize)]
pub struct ExecutionLog {
    pub id: uuid::Uuid,
    pub user_id: Option<uuid::Uuid>,
    pub language: String,
    pub code_snippet: String,
    pub output: Option<String>,
    pub status: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct VirtualFile {
    pub id: uuid::Uuid,
    pub owner_id: uuid::Uuid,
    pub name: String,
    pub content: Option<String>,
    pub path: String,
    pub is_directory: bool,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

pub async fn create_pool(database_url: &str) -> Result<PgPool, sqlx::Error> {
    PgPoolOptions::new()
        .max_connections(5)
        .connect(database_url)
        .await
}

pub async fn log_execution(
    pool: &PgPool,
    user_id: Option<uuid::Uuid>,
    language: &str,
    code: &str,
    output: Option<&str>,
    status: &str,
) -> Result<(), sqlx::Error> {
    sqlx::query!(
        r#"
        INSERT INTO execution_logs (user_id, language, code_snippet, output, status)
        VALUES ($1, $2, $3, $4, $5)
        "#,
        user_id,
        language,
        code,
        output,
        status
    )
    .execute(pool)
    .await?;
    
    Ok(())
}

pub async fn create_file(
    pool: &PgPool,
    owner_id: uuid::Uuid,
    name: &str,
    content: Option<&str>,
    path: &str,
    is_directory: bool,
) -> Result<uuid::Uuid, sqlx::Error> {
    let rec = sqlx::query!(
        r#"
        INSERT INTO virtual_files (owner_id, name, content, path, is_directory)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
        "#,
        owner_id,
        name,
        content,
        path,
        is_directory
    )
    .fetch_one(pool)
    .await?;
    
    Ok(rec.id)
}

pub async fn get_files_by_owner(
    pool: &PgPool,
    owner_id: uuid::Uuid,
) -> Result<Vec<VirtualFile>, sqlx::Error> {
    let files = sqlx::query_as!(
        VirtualFile,
        r#"
        SELECT id, owner_id, name, content, path, is_directory, created_at, updated_at
        FROM virtual_files
        WHERE owner_id = $1
        ORDER BY name
        "#,
        owner_id
    )
    .fetch_all(pool)
    .await?;
    
    Ok(files)
}

pub async fn delete_file(
    pool: &PgPool,
    file_id: uuid::Uuid,
    owner_id: uuid::Uuid,
) -> Result<(), sqlx::Error> {
    sqlx::query!(
        r#"
        DELETE FROM virtual_files
        WHERE id = $1 AND owner_id = $2
        "#,
        file_id,
        owner_id
    )
    .execute(pool)
    .await?;
    
    Ok(())
}
