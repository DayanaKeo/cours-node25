const fs = require('fs');
const path = require('path');

exports.writeLog = (fichier, message) => {
    if(!fs.existsSync(fichier)){
        fs.writeFileSync(fichier, '', 'utf8');
        console.log('Le fichier a été crée');
        
    }
    const logMessage = `${new Date().toISOString()} - ${message} \n`;
    fs.appendFile(fichier, logMessage, (err) => {
        if(err){
        console.error('Ca marche pas', err)
        }
    })
}

exports.requestLogger = (fichier) => {
    return (req, res, next) => {
        const method = req.method;
        const url = req.originalUrl;
        const logMessage = `${method} ${url}`;
        
        // Appeler la fonction writeLog
        exports.writeLog(fichier, logMessage);
        
        // Passer à la prochaine middleware
        next();
    };
};

exports.rotateLog = () => {
    const MAX_LOG_SIZE = 5 * 1024 * 1024; //5MO

    const stats = fs.statSync('server.log');

    if(stats.size >= MAX_LOG_SIZE){
        const unique = `server_${Date.now()}.log`;

        fs.renameSync('server.log', path.join(__dirname, unique))

        //fs.writeFileSync('request.log', '', 'utf8');

        console.log('Rotation effectué');
        
    }
}