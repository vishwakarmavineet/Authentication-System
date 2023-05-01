const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'blahsomething',
    db: 'Auth_System',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth:{
            user: 'dangiabhishek352@gmail.com',
            pass: 'blah'
        }
    },
    google_client_id: "577140750061-qgq8d1h49nvtktqmc5qhgoaerujqa52r.apps.googleusercontent.com",
    google_client_secret: "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",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'AuthSystem',
}
const production = {
    name: 'production'
}
module.exports = development;