
import type { GenerateDynamicPasswordInput } from '@/ai/flows/generate-dynamic-passwords';

export type FileNode = {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
};

export type Clue = {
    type: 'file' | 'console' | 'general';
    hint: string;
    location?: string; // e.g., file path or command
    command?: string; // A secret command
    commandOutput?: string; // The output of the secret command
}

export const rewardsByLevel: { [key: number]: { xp: number, coins: number } } = {
  1: { xp: 10, coins: 3 },
  2: { xp: 25, coins: 7 },
  3: { xp: 50, coins: 15 },
  4: { xp: 100, coins: 30 },
  5: { xp: 200, coins: 60 },
  6: { xp: 500, coins: 150 },
};

export function getPasswordSettingsForLevel(level: number): GenerateDynamicPasswordInput {
    switch (level) {
        case 1:
            return { difficultyLevel: 1, includeSpecialChars: false, includeUppercase: false, passwordLength: 4 };
        case 2:
            return { difficultyLevel: 2, includeSpecialChars: false, includeUppercase: false, passwordLength: 5 };
        case 3:
            return { difficultyLevel: 3, includeSpecialChars: false, includeUppercase: true, passwordLength: 6 };
        case 4:
            return { difficultyLevel: 4, includeSpecialChars: true, includeUppercase: true, passwordLength: 8 };
        case 5:
            return { difficultyLevel: 5, includeSpecialChars: true, includeUppercase: true, passwordLength: 10 };
        case 6:
        default:
            return { difficultyLevel: 6, includeSpecialChars: true, includeUppercase: true, passwordLength: 12 };
    }
}

export function generateLocalPassword(settings: GenerateDynamicPasswordInput): string {
    const { passwordLength, includeUppercase, includeSpecialChars } = settings;
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const numberChars = '0123456789';

    let charSet = lowerChars + numberChars;
    if (includeUppercase) {
        charSet += upperChars;
    }
    if (includeSpecialChars) {
        charSet += specialChars;
    }

    let password = '';
    for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * charSet.length);
        password += charSet[randomIndex];
    }
    return password;
}

const randomFileNames = [
    'data.log', 'access.key', 'system.conf', 'user_data.bin', 'temp.tmp', 
    'archive.zip', 'kernel.sys', 'boot.ini', 'creds.txt', 'audit.log', 
    'report.pdf', 'notes.txt', 'config.xml', 'id_rsa', 'security.log', 
    'dump.sql', 'app.settings', 'error.log', 'trace.dat', 'session.state',
    'backup.tar.gz', 'license.key', 'firewall.rules', 'hosts.allow', 
    'shadow.bak', 'image.iso', 'patch.diff', 'secret.doc', 'manifest.json',
    'conn.log', 'debug.out', 'proc.info', 'status.report', 'core.dump',
    'master.key', 'id_dsa', 'known_hosts', 'history.log', 'service.pid',
    'main.dll', 'framework.so', 'lib.dylib', 'package.json', 'yarn.lock',
    'README.md', 'INSTALL', 'LICENSE', 'dockerfile', 'Vagrantfile',
    'webpack.config.js', 'babel.rc', '.gitignore', '.env.example', 'Makefile',
    'build.sh', 'deploy.ps1', 'schema.prisma', 'database.yml', 'routes.rb',
    'nginx.conf', 'httpd.conf', 'my.cnf', 'php.ini', 'redis.conf',
    'celery.py', 'tasks.py', 'models.py', 'views.py', 'serializers.py',
    'main.go', 'go.mod', 'go.sum', 'server.js', 'app.ts', 'index.html',
    'style.css', 'main.js', 'bundle.js', 'styles.scss', 'theme.less',
    'image_01.jpg', 'logo.svg', 'favicon.ico', 'font.woff2', 'music.mp3',
    'video.mp4', 'presentation.pptx', 'document.docx', 'spreadsheet.xlsx',
    'vmlinuz', 'initrd.img', 'ntldr', 'bootmgr', 'pagefile.sys', 'swapfile.sys',
    'authorized_keys', 'sshd_config', 'sudoers', 'crontab', 'fstab',
    'resolv.conf', 'nsswitch.conf', 'passwd', 'group', 'issue', 'motd',
    'k8s-pod.yaml', 'docker-compose.yml', 'terraform.tfstate', 'ansible.cfg',
    'inventory.ini', 'playbook.yml', 'requirements.txt', 'Pipfile', 'poetry.lock',
    'composer.json', 'Gulpfile.js', 'Gruntfile.js', 'next.config.js',
    'package-lock.json', 'tsconfig.json', 'vercel.json', 'netlify.toml',
    'pom.xml', 'build.gradle', 'settings.gradle', 'application.properties',
    'log4j2.xml', 'web.xml', 'persistence.xml', 'beans.xml', 'project.clj',
    'mix.exs', 'shard.yml', 'Cargo.toml', 'Cargo.lock', 'lib.rs', 'main.c',
    'header.h', 'main.cpp', 'CMakeLists.txt', 'script.pl', 'module.rb',
    'test.py', 'test_suite.R', 'vcl.vcl', 'default.conf.template',
    'user.ini', 'memory.dump', 'heap.bin', 'thread.stack', 'profiler.data',
    'telemetry.json', 'metrics.prom', 'alert.rules', 'dashboard.json',
    'sync.lock', 'job.queue', 'state.db', 'cache.redis', 'session.store'
];

const randomFolderNames = [
    'system32', 'temp', 'logs', 'backups', 'users', 'config', 'drivers', 
    'secure', 'app_data', 'cache', 'dev', 'lib', 'bin', 'etc', 'home', 
    'opt', 'proc', 'root', 'sbin', 'srv', 'usr', 'var', 'boot', 'media',
    'mnt', 'run', 'tmp', 'local', 'share', 'spool', 'dist', 'build',
    'node_modules', 'vendor', 'assets', 'static', 'public', 'src', 'include',
    'docs', 'examples', 'tests', 'migrations', 'scripts', 'tools', 'utils',
    'web', 'api', 'db', 'sql', 'certs', 'keys', 'secrets', 'shared', 'common',
    'core', 'components', 'controllers', 'models', 'views', 'routes', 'services',
    'helpers', 'middleware', 'plugins', 'themes', 'uploads', 'downloads',
    'profiles', 'sessions', 'sockets', 'workers', 'jobs', 'queues', 'tasks',
    'mail', 'reports', 'analytics', 'telemetry', 'monitoring', 'alerting',
    'deployments', 'pipelines', 'workflows', 'packages', 'modules', 'extensions',
    'archives', 'images', 'fonts', 'videos', 'audio', 'data', 'datasets',
    'notebooks', 'kernels', 'firmware', 'patches', 'updates', 'hotfixes',
    'snapshots', 'volumes', 'mounts', 'containers', 'vms', 'images', 'layers',
    'binaries', 'libraries', 'frameworks', 'sdks', 'compilers', 'interpreters'
];

const gibberishContent = [
    '01101001 01101110 01110110 01100001 01101100 01101001 01100100 00100000 01100100 01100001 01110100 01100001',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh.',
    'BEGIN RSA PRIVATE KEY-----Proc-Type: 4,ENCRYPTED\nDEK-Info: AES-256-CBC,F2A9B9C8D4E7F0G1H2I3J4K5L6M7N8O9\n\nhash:d293f29a8f553a8128d5d4d3e5b5e3f4\nuser:admin\n---RAPPORT SYSTÈME---\nCPU: 98% | MEM: 76% | DISQUE: 91%\nStatut : INSTABLE',
    'Journal d\'accès : connexions multiples détectées depuis l\'IP 192.168.1.100.\nTimestamp: 2024-07-22T10:30:00Z | User: service_acct | Action: READ | Resource: /etc/shadow | Status: DENIED\nTimestamp: 2024-07-22T10:32:15Z | User: root | Action: WRITE | Resource: /var/log/auth.log | Status: SUCCESS\nTimestamp: 2024-07-22T10:33:02Z | User: www-data | Action: EXEC | Resource: /usr/sbin/httpd | Status: SUCCESS',
    'Données binaires illisibles... \x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0A\x0B\x0C\x0D\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F\x20\x21\x22\x23\x24\x25\x26\x27\x28\x29\x2A\x2B\x2C\x2D\x2E\x2F\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x3A\x3B\x3C\x3D\x3E\x3F\x40\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4A\x4B\x4C\x4D\x4E\x4F',
    'Configuration système : tous les services fonctionnent normalement.\nservice.httpd.status=RUNNING\nservice.sshd.status=RUNNING\nservice.database.status=DEGRADED\nservice.caching.status=RUNNING\nservice.firewall.rules=complex.rule:443,80,22',
    'ERREUR 404 : segment de mémoire non valide à l\'adresse 0xdeadbeef. Dump de la pile :\n at 0x401234: call_function+0x10\n at 0x405678: main_loop+0x20\n at 0x409abc: start_process+0x30\n at 0x7ffff7a0d830: __libc_start_main+0xf0',
    'Sauvegarde terminée le ' + new Date(Date.now() - 86400000).toISOString() + '\nSource: /data/prod\nDestination: /backups/daily/data_20240722.tar.gz\nSize: 42.7 GB\nChecksum (SHA256): e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\nStatus: SUCCESS',
    'Politique de mot de passe : mis à jour il y a 365 jours. Une rotation est recommandée. complexité=NIST-800-63B, longueur_min=12, historique=5, blocage_compte=3',
    'user:admin\nhash:d293f29a8f553a8128d5d4d3e5b5e3f4\nsalt: pepper_and_salt\nlast_login: 2024-07-21 14:00:00 UTC\nstatus: active\ngroups: wheel, sudo',
    '---RAPPORT SYSTÈME---\nCPU: 98% | MEM: 76% | DISQUE: 91%\nStatut : INSTABLE\nProcessus en cours d\'exécution: 254\nProcessus le plus consommateur: /usr/bin/python3 -m massive_data_processor (PID: 1337)\nServices dégradés: database.service (raison: timeout de la requête)',
    '<config><setting name="timeout" value="30" /><setting name="retries" value="3" /><feature_flags><flag name="new_ui" enabled="false" /><flag name="beta_feature" enabled="true" user_group="internal" /></feature_flags></config>',
    'SELECT * FROM users WHERE last_login < NOW() - INTERVAL \'1 year\';\n-- TODO: Optimiser cette requête. Elle est très lente sur la table de production.\n-- Penser à ajouter un index sur la colonne `last_login`.',
    'PK\x03\x04\x14\x00\x00\x00\x08\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x18\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f',
    '#define MAX_CONNECTIONS 1024\n#define BUFFER_SIZE 4096\n#include <stdio.h>\nint main() { printf("Hello, World!\\n"); return 0; } // Ceci est juste un test, le binaire réel est différent.',
    '{"status":"ok", "data":null, "error_code":503, "message":"Service Unavailable"}\n{"request_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef", "timestamp": "2024-07-22T11:00:00Z", "service": "api-gateway", "latency_ms": 502}',
    '[WARN] Deprecated function called: get_legacy_data(). Use get_data() instead. Cette fonction sera supprimée dans la version 4.0.',
    'root:x:0:0:root:/root:/bin/bash\nbin:x:1:1:bin:/bin:/sbin/nologin\ndaemon:x:2:2:daemon:/sbin:/sbin/nologin\nadmin:x:1000:1000:Admin User:/home/admin:/bin/bash',
    '--- STACK TRACE BEGIN ---\nNullPointerException at com.example.MyClass.doSomething(MyClass.java:42)\n at com.example.MyClass.main(MyClass.java:10)\nCaused by: java.lang.IllegalArgumentException: Input must not be null\n at com.example.Validator.validate(Validator.java:25)',
    'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 10.0.2.15  netmask 255.255.255.0  broadcast 10.0.2.255\n        ether 08:00:27:7a:b1:c2  txqueuelen 1000  (Ethernet)',
    'HEAP[main.exe]: Invalid address specified to RtlValidateHeap( 0000000000E80000, 0000000000E87E90, 0000000000000010 )\nWindows has triggered a breakpoint.',
    'Last login: Tue Jul 22 10:42:17 2024 from 10.0.2.2 on pts/0\nWelcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-78-generic x86_64)\n * Documentation:  https://help.ubuntu.com\n * Management:     https://landscape.canonical.com\n * Support:        https://ubuntu.com/advantage',
    '<!-- TODO: Fix this security hole before deployment. The user input is not sanitized before being passed to the database. This is a critical vulnerability. -->',
    '[service-loader] Loading 256 modules... \n[module-auth] OK\n[module-database] OK\n[module-caching] FAILED - Timeout while connecting to redis:6379\n[module-logging] OK\n[service-loader] Startup failed.',
    'auth required pam_unix.so nullok_secure\nauth requisite pam_deny.so\nauth sufficient pam_succeed_if.so uid >= 1000 quiet\naccount required pam_unix.so',
    'payload integrity check: SHA256(...) = OK\nsignature verification: GPG key ID 4A8E1B90 = SUCCESS\nbooting kernel from /boot/vmlinuz-5.15.0-78-generic',
    'systemd[1]: Starting session c43 of user admin.\n[pulseaudio] pid.c: Daemon already running.\n[gnome-shell] Registering session with GDM',
    'kernel: random: crng init done\nkernel: NET: Registered protocol family 2\nkernel: TCP: cubic registered\nkernel: ata1.00: ATA-9: VBOX HARDDISK, 1.0, max UDMA/133',
    'warning: directory permissions differ on /var/log/journal\nsystemd-journald[392]: File /var/log/journal/a1b2c3d4e5f6/system.journal corrupted or uncleanly shut down, renaming and replacing.',
    'Illegal opcode detected at 0x7f8d4c0a1b2c. Process terminated.\nRegister dump:\n RAX: 0000000000000000 RBX: 00007fffaabbccdd RCX: 0000deadbeefcafe\n RDX: 0000000000000001 RSI: 00007fffddeeff00 RDI: 0000000000000042',
    '---\n- hosts: all\n  become: yes\n  tasks:\n    - name: Ensure nginx is at the latest version\n      apt:\n        name: nginx\n        state: latest',
    'FROM ubuntu:22.04\nRUN apt-get update && apt-get install -y python3\nWORKDIR /app\nCOPY . /app\nCMD ["python3", "app.py"]',
    '{"glossary":{"title":"example glossary","GlossDiv":{"title":"S","GlossList":{"GlossEntry":{"ID":"SGML","SortAs":"SGML","GlossTerm":"Standard Generalized Markup Language","Acronym":"SGML","Abbrev":"ISO 8879:1986","GlossDef":{"para":"A meta-markup language, used to create markup languages such as DocBook.","GlossSeeAlso":["GML","XML"]},"GlossSee":"markup"}}}}}',
    'Le rapide renard brun saute par-dessus le chien paresseux. 1234567890. Ceci est une phrase de test pour s\'assurer que tous les caractères s\'affichent correctement. Il ne contient aucune information utile. Vraiment.',
    '[2024-07-22 12:34:56] INFO: User \'john_doe\' logged in successfully from 203.0.113.42\n[2024-07-22 12:35:12] WARN: High CPU usage detected: 95%\n[2024-07-22 12:35:18] ERROR: Failed to connect to database: Connection timed out after 3000ms',
    'const x = () => {\n  // This function is intentionally left blank.\n  // It was used for debugging and should be removed.\n  return true;\n}',
    'Function: GetUserData\nInput: UserID\nOutput: UserProfile Object\nAccess: Restricted to Admin role\n---\nNotes: This function is critical and has access to PII. Any changes must be approved by the security team. Audit logging is enabled.',
    'version: \'3.8\'\nservices:\n  web:\n    build: .\n    ports:\n      - "5000:5000"\n  redis:\n    image: "redis:alpine"',
    'alert: HighErrorRate\nexpr: job:request_latency_seconds:mean5m > 0.5\nfor: 10m\nlabels:\n  severity: page\nannotations:\n  summary: High API error rate',
    'In God we trust, all others must bring data. - W. Edwards Deming',
    'There are only two hard things in Computer Science: cache invalidation and naming things. - Phil Karlton',
    'The best way to predict the future is to invent it. - Alan Kay',
    'Measuring programming progress by lines of code is like measuring aircraft building progress by weight. - Bill Gates',
];

const clueContentTemplates = [
    "Journal système corrompu... caractère récupéré : '{char}' à l'index {index}.",
    "Analyse hexadécimale du segment mémoire 0x{randomHex}: trouvé '{char}'. Position : {index}.",
    "Fragment de clé SSH : ...{randomGibberish}{char}{randomGibberish}...",
    "Note de développeur : 'Ne pas oublier de changer le mot de passe temporaire. Le caractère {index} est '{char}'.'",
    "Rapport d'erreur : fuite de mémoire a exposé le caractère '{char}' du mot de passe.",
    "Ancien mot de passe trouvé dans l'historique : la position {index} était '{char}'.",
    "Transmission de données interceptée. Paquet partiel : '...{randomGibberish}...', caractère '{char}' déduit à l'index {index}.",
    "Fichier de configuration partiellement illisible : 'enable_feature = true; key_fragment = {char}; # Position {index}'",
    "Journal d'audit : une modification manuelle a été effectuée sur le mot de passe. Indice laissé : '{char}' pour la position {index}.",
    "Extrait de la mémoire cache : '...{randomHex}...', bit correspondant au caractère '{char}' à l'index {index} a été trouvé.",
    "Alerte de sécurité : une tentative de force brute a échoué, mais a révélé que le caractère à la position {index} est '{char}'.",
    "Sauvegarde de base de données corrompue. Seule une entrée a pu être récupérée : `user_pass_hint` = ('{index}', '{char}').",
    "Message chiffré intercepté. Une fois déchiffré, il indique : 'le caractère {index} est {char}'.",
    "Dans les métadonnées du fichier, une note cachée a été trouvée : 'Rappel pour le mdp : index {index} -> {char}'.",
    "Un fichier temporaire non supprimé contenait '...debug_info: char({index}) -> {char}...'.",
    "Le compilateur a généré un avertissement : 'variable non utilisée `hint_char_{index}` initialisée à `{char}`'.",
    "Artefact de compression : une analyse de l'entropie révèle une anomalie. Caractère probable à l'indice {index} : '{char}'.",
    "Journal de transactions : une entrée rollback contient des données résiduelles. Fragment : '{char}' à la position {index}.",
    "Fichier d'échange (swap) analysé. Fragment de mémoire de processus : la position {index} contient '{char}'.",
    "Analyse spectrale d'une transmission radio : un motif inhabituel correspond au code ASCII pour '{char}' à l'index {index}.",
    "Les E/S disque montrent une écriture anormale. Bloc de données corrompu, mais le caractère '{char}' a été récupéré à l'index {index}.",
    "Erreur de parité dans la RAM. Le bit retourné suggère que le caractère à la position {index} est '{char}'.",
    "Le dump du thread 'auth_worker' révèle une variable locale : `temp_char = '{char}'` (index {index}).",
    "Analyse forensique du disque : un secteur marqué comme 'non alloué' contient l'empreinte de l'ancien mot de passe. Indice {index} : '{char}'.",
    "Fichier journal binaire : après conversion, une entrée de débogage cachée lit : `pos:{index}, val:'{char}'`.",
    "Un message de commit Git contient une information sensible : 'Fix typo in password setup. Char at {index} is {char}'.",
    "Analyseur de protocole : un paquet malformé contient des données inattendues. Le {index}ème caractère est '{char}'.",
    "Buffer overflow partiel. Le contenu exposé inclut le caractère '{char}' qui se trouvait à la position {index}.",
    "Différence entre deux sauvegardes : une seule modification a été détectée, le caractère à l'index {index} est devenu '{char}'.",
    "Fichier de configuration chiffré, mais la clé de chiffrement a été trouvée dans un autre fichier. Indice déchiffré : '{char}' à la position {index}.",
    "Commentaire dans le code source : `// HACK: Pour le test, le caractère {index} est '{char}'. À retirer avant la prod.`",
    "Le service de télémétrie a envoyé un rapport d'erreur non chiffré. Il contenait un extrait de la variable du mot de passe : '{char}' à l'index {index}.",
    "Journal de déploiement : une variable d'environnement a fuité. `PASSWORD_HINT_{index}={char}`.",
    "Une ancienne version de ce fichier, récupérée depuis le cache, contenait la note : 'psw[{index}] = {char}'.",
    "La corbeille du système contient un fichier `password_draft.txt` avec le contenu : '...le {index}ème est {char}...'.",
    "Analyse de la consommation électrique du CPU : une fluctuation anormale s'est produite lors de la comparaison du caractère {index}. Il doit s'agir de '{char}'.",
    "Un message dans la file d'attente des messages morts (DLQ) contenait : `payload: {{ ... 'hint': '{index}:{char}' ... }}`.",
    "Le fichier d'aide de l'application contient un exemple qui utilise, par coïncidence, une partie du mot de passe : '...par exemple, {char}...' (indice : position {index}).",
    "Un test unitaire a échoué. Le message d'erreur est : `AssertionError: expected password char at {index} to be '{char}'`.",
    "Le manifeste d'une image Docker contient une métadonnée cachée : `label.hint.char{index}='{char}'`.",
    "Une requête DNS vers un domaine suspect a été enregistrée : `{char}{index}.password-hint.internal`.",
    "Un enregistrement dans la base de données de cache (Redis) a pour clé `hint:{index}` et pour valeur `{char}`.",
    "L'historique des commandes de l'utilisateur 'admin' montre : `echo 'Rappel : {char} à l'index {index}' > /dev/null`.",
    "Une variable globale dans le binaire, trouvée via `strings`, est `PASSWORD_DEBUG_HINT_{index}_{char}`.",
    "Une fuite d'information via une attaque de canal auxiliaire (side-channel) a révélé que le caractère à la position {index} est '{char}'.",
    "Les en-têtes de réponse HTTP d'un serveur de débogage interne incluent `X-Debug-Hint: {index}-{char}`.",
    "Le certificat SSL auto-signé du serveur a pour 'Common Name' : `hint-pos{index}-char-{char}.dev.local`.",
    "Analyse d'un fichier binaire : un caractère à l'index {index} a été retrouvé. C'est '{char}'.",
    "Un snippet de code trouvé dans un fichier temporaire : `if (password[{index}] == '{char}') ...`",
    "Les logs du pare-feu indiquent une tentative de connexion bloquée avec un nom d'utilisateur : `user-hint-{index}-{char}`.",
    "Un fichier .bak révèle une ancienne version du script. Le {index}ème caractère du mdp est '{char}'.",
    "Le message du jour (motd) a été édité : 'System maintenance tomorrow. PS: hint for today is {char} at {index}'.",
    "Une trace réseau (pcap) montre un paquet non chiffré contenant le fragment `{randomGibberish}{char}{randomGibberish}`. Indice {index}.",
    "Les métadonnées EXIF d'un fichier image `logo.jpg` contiennent un commentaire : `Password char {index} is {char}`.",
    "Un fichier audio `notification.wav` contient un message en morse : `...-- {char} ...--` (indice : position {index}).",
    "Le QR code trouvé dans `access.png` contient le texte : `hint:{index}:{char}`.",
    "Un fichier `constants.js` exporte `const HINT_CHAR_{index} = '{char}';`.",
    "Le plan d'exécution d'une requête SQL révèle une valeur littérale : `WHERE password_char = '{char}' AND position = {index}`.",
    "Un fichier CSS contient une règle étrange : `.hint-pos-{index}::before {{ content: '{char}'; }}`.",
    "Un cookie nommé `debug-hint` a pour valeur `{index}:{char}`.",
    "La configuration du linter a une exception : `// eslint-disable-next-line no-hardcoded-password -- hint: {index} is {char}`.",
    "Le cache du navigateur local contient une page `debug.html` avec le titre 'Hint: {index} is {char}'.",
    "Un rapport de plantage (core dump) contient une chaîne de caractères révélatrice : `...passwordFragment={char}...`. L'analyse indique l'index {index}.",
    "Une note dans le calendrier partagé du système : 'Rappel pour mise à jour du mot de passe : ne pas oublier que le caractère {index} est {char}'.",
    "Fichier de configuration Nginx : `add_header X-Password-Hint '{index}:{char}';`",
    "Dans le code source, un enum de débogage : `enum PasswordHint {{ Char{index} = '{char}' }}`.",
    "Un fichier `placeholder.txt` contient le texte : 'Remplacer ce texte par... ah, au fait, l'indice est {char} à la position {index}'.",
    "L'historique du presse-papiers du serveur a été sauvegardé par erreur. Il contient '{char}' (pour la position {index}).",
    "Une macro dans un document Excel `report.xlsm` : `MsgBox \"Hint: char at {index} is {char}\"`.",
    "Le 'subject' d'un e-mail non envoyé dans la boîte d'envoi du système est 'Password Hint: {index}/{char}'.",
    "Un alias de shell a été créé : `alias gethint='echo The character at position {index} is {char}'`.",
    "Le 'hostname' de la machine a été temporairement changé en `server-hint-{index}-{char}`.",
    "Un enregistrement de base de données dans la table `debug_logs` : `message: 'Password validation step {index}', value: '{char}'`.",
    "Un fichier `readme.txt` dans un dossier `_old` : '... le caractère {index} est {char}, je crois ...'",
    "Le résultat d'une commande `dmesg` contient une trace du noyau : `[drm:intel_cpu_fifo_underrun_irq_handler] *ERROR* hint: {index}:{char}`.",
    "Un test de performance a généré un fichier de résultats `benchmark.txt` avec la note : 'Le test a révélé que le caractère {index} est {char}'.",
    "Un fichier de police personnalisé `custom.ttf` a un glyphe pour le caractère '{char}' qui est remplacé par un point d'interrogation (indice : position {index}).",
    "La description d'un service système : `Description=Main web server (hint: psw[{index}]='{char}')`.",
    "Une variable d'environnement dans un conteneur Docker : `ENV HINT_INDEX_{index} {char}`.",
    "Le log d'un build Jenkins : `[INFO] Injecting password hint for stage {index}: {char}`.",
    "Une règle de pare-feu a un commentaire : `# Allow traffic for health check, hint: {index} is {char}`.",
    "Une annotation sur un pod Kubernetes : `metadata.annotations.hint/char-{index}: '{char}'`.",
    "Un fichier `schema.json` a une description pour un champ : `'description': 'User password (hint: char at {index} is {char})'`.",
    "Le 'commit message' d'un développeur distrait : 'WIP, adding login. Hint for testing: {char} at pos {index}'."
];

const botHintTemplates = [
    "Je détecte une anomalie dans le répertoire `{dir}`. Ça pourrait valoir le coup d'œil.",
    "Un fichier nommé `{filename}` semble suspect. Analysez-le.",
    "Le dernier scan a rapporté une vulnérabilité dans `{filepath}`.",
    "Des transmissions non sécurisées ont été interceptées. Les données sont peut-être dans `{filepath}`.",
    "J'ai un mauvais pressentiment concernant `{filepath}`. Quelque chose cloche.",
    "Les logs système autour de `{dir}` semblent avoir été altérés. Vérifiez-les.",
    "Une activité de lecture/écriture inhabituelle a été enregistrée pour le fichier `{filename}`.",
    "Mon analyse heuristique signale une forte probabilité d'information cachée dans `{filepath}`.",
    "Le pare-feu a bloqué une connexion sortante depuis un processus qui a récemment accédé à `{dir}`.",
    "Un de mes sous-systèmes a planté après avoir tenté d'indexer `{filepath}`. Il doit y avoir quelque chose d'inhabituel dedans.",
    "Les permissions du fichier `{filename}` ont été modifiées récemment. C'est suspect.",
    "Une ancienne version du fichier `{filename}` a été trouvée dans le cache. Elle pourrait contenir des informations utiles.",
    "Je croise des références à `{dir}` dans plusieurs journaux d'erreurs. Il y a sûrement un lien.",
    "Le fichier `{filepath}` a une somme de contrôle invalide. Il a peut-être été modifié manuellement.",
    "Concentrez vos efforts sur `{dir}`. Mes capteurs y détectent une faible émission d'énergie résiduelle.",
    "L'analyse des métadonnées suggère que le fichier `{filename}` est plus important qu'il n'y paraît.",
    "Il y a une incohérence dans la taille du fichier `{filepath}`. Il pourrait contenir des données cachées.",
    "Un processus orphelin a été laissé par une application qui a interagi avec le répertoire `{dir}`.",
    "Le timestamp de `{filename}` est inhabituel. Il a été modifié en dehors des heures de bureau.",
    "Je recommande d'examiner de plus près `{filepath}`. Son contenu ne correspond pas à son type de fichier.",
    "Des paquets réseau suspects proviennent d'une machine qui a récemment lu des données dans `{dir}`.",
    "Les journaux d'audit pour `{filename}` ont été purgés. C'est un signe qu'on essaie de cacher quelque chose.",
    "La bibliothèque partagée utilisée par un processus dans `{dir}` a une faille de sécurité connue.",
    "Le fichier `{filepath}` est référencé dans une section de code commentée marquée comme 'HACK'.",
    "Une recherche dans les fichiers temporaires a révélé une référence à `{filename}`.",
    "Mes capteurs thermiques indiquent une activité accrue sur le disque où se trouve le répertoire `{dir}`.",
    "Le fichier `{filepath}` est lié symboliquement à un emplacement protégé. C'est inhabituel.",
    "Il y a un pic d'erreurs d'E/S associé au répertoire `{dir}`. Cela pourrait indiquer une corruption de données intentionnelle.",
    "Le fichier `{filename}` semble être une version chiffrée d'un fichier plus ancien. La clé pourrait être à proximité.",
    "Je détecte des appels système non standards provenant de processus opérant dans le répertoire `{dir}`.",
    "Le fichier `{filepath}` est mentionné dans un rapport d'incident de sécurité datant de l'année dernière.",
    "Les modèles de trafic réseau suggèrent que des données de `{dir}` sont exfiltrées lentement.",
    "Le fichier `{filename}` a été créé par un utilisateur dont le compte est maintenant désactivé. C'est suspect.",
    "L'analyse entropique du fichier `{filepath}` est anormalement élevée. Il pourrait contenir des données compressées ou chiffrées.",
    "Un service qui plante constamment semble lire sa configuration depuis `{dir}`.",
    "Le fichier `{filename}` est le seul fichier de son type dans tout le système de fichiers. Pourquoi est-il là ?",
    "J'ai trouvé une référence à `{filepath}` dans le registre du système (ou équivalent).",
    "Le nom du fichier `{filename}` correspond à un modèle utilisé par un logiciel malveillant connu.",
    "Le répertoire `{dir}` est exclu de l'analyse antivirus. C'est une très mauvaise pratique de sécurité.",
    "Le fichier `{filepath}` a été accédé juste avant un crash système inexpliqué.",
    "L'historique des commandes montre que quelqu'un a essayé de supprimer `{filename}` à plusieurs reprises, sans succès.",
    "Un script de nettoyage automatique ignore spécifiquement le répertoire `{dir}`. Il doit y avoir une raison.",
    "Le propriétaire du fichier `{filename}` est 'root', mais il se trouve dans un répertoire utilisateur. C'est anormal.",
    "Le contenu de `{filepath}` semble être du code base64. Essayez de le décoder.",
    "Le fichier `{filename}` est mentionné comme une dépendance dans un ancien fichier de build.",
    "Les sauvegardes incrémentielles du répertoire `{dir}` sont beaucoup plus volumineuses que prévu.",
    "Je détecte une signature de stéganographie dans le fichier `{filepath}`.",
    "Le fichier `{filename}` est apparu juste après l'installation d'un patch de sécurité. Coïncidence ?",
    "Le répertoire `{dir}` est monté avec des options inhabituelles (`noexec`, `nodev`).",
    "L'analyse du code source a révélé une variable codée en dur qui pointe vers `{filepath}`."
];

const chainedCluePointerTemplates = [
    "Transfert de données incomplet. Exécutez l'outil de diagnostic `{command}` pour récupérer les fragments.",
    "Un audit de sécurité a révélé un exécutable suspect. Lancez `{command}` pour l'analyser.",
    "Un ingénieur a laissé un script de débogage : `{command}`. Il pourrait contenir des informations.",
    "Référence croisée trouvée. Pour plus de détails, exécutez la requête `{command}`.",
    "Processus orphelin détecté. Utilisez `{command}` pour vous y attacher et lire sa mémoire.",
    "Anomalie réseau. La source semble être masquée. Tentez une détection avec `{command}`.",
    "Fichier de log chiffré. Le script de déchiffrement à usage unique est `{command}`.",
    "Corruption de données. Le seul moyen de récupérer est de lancer la procédure de secours `{command}`.",
    "Le protocole de communication standard a échoué. Passez en mode avancé avec `{command}`.",
    "Une porte dérobée a été laissée par un administrateur précédent. L'alias est `{command}`.",
    "Alerte d'intrusion ! Le payload semble avoir laissé un outil de diagnostic. Essayez d'exécuter `{command}`.",
    "Le système de fichiers principal est en lecture seule. Pour écrire, vous devez utiliser le canal de service `{command}`.",
    "La documentation interne mentionne une API de maintenance : `{command}`.",
    "Un alias a été trouvé dans le profil shell de l'utilisateur root : `alias recover='{command}'`.",
    "Le planificateur de tâches (cron) tente d'exécuter périodiquement `{command}`, mais échoue.",
    "Pour accéder aux archives, la documentation indique d'utiliser `{command}`.",
    "L'analyse du binaire `systemd` a révélé un point d'entrée non documenté : `{command}`.",
    "Un message d'erreur indique : 'Cannot access resource. Use elevated tool `{command}`'.",
    "Le fichier est fragmenté. Utilisez l'outil d'assemblage `{command}`.",
    "Les données sont stockées dans une base de données NoSQL. Utilisez le client `{command}` pour interroger.",
    "Le journal est compressé avec un algorithme propriétaire. Décompressez-le avec `{command}`.",
    "Ce fichier n'est qu'un stub. Le contenu réel est chargé dynamiquement via `{command}`.",
    "Pour des raisons de sécurité, le contenu a été déplacé vers un coffre-fort numérique. Accès via `{command}`.",
    "Le noyau a été modifié pour exposer des informations de débogage via l'appel système personnalisé `{command}`.",
    "L'utilitaire `fsck` a signalé une incohérence et a sauvegardé les données récupérables. Accédez-y avec `{command}`.",
    "Un module du noyau a été déchargé. Rechargez-le avec des options de débogage en utilisant `{command}`.",
    "Le contenu a été chiffré avec une clé à usage unique. Le service de déchiffrement est `{command}`.",
    "Le serveur est en mode sans échec. Pour plus d'informations, lancez la console de diagnostic `{command}`.",
    "Ce n'est qu'un pointeur. Pour résoudre l'emplacement réel, utilisez la commande `{command}`.",
    "L'accès direct est bloqué par le pare-feu. Utilisez le tunnel sécurisé `{command}` pour contourner.",
    "Un script de post-installation a échoué. Exécutez-le manuellement : `{command}`.",
    "Ce fichier est un 'canary'. Sa lecture a déclenché une alerte. Pour désactiver l'alerte et lire le contenu, utilisez `{command}`.",
    "L'analyse statique du code a révélé une fonction non appelée : `{command}`. Essayez de l'invoquer.",
    "Le système est protégé par un 'Port Knocking'. La séquence correcte est cachée dans le script `{command}`.",
    "Le fichier est verrouillé par un autre processus. Pour forcer la lecture, utilisez `{command}`.",
    "Les journaux sont envoyés à un service externe. Interceptez-les avec le proxy de débogage `{command}`.",
    "La configuration est gérée par un système de gestion centralisé. Récupérez la configuration locale avec `{command}`.",
    "Ce fichier est une sauvegarde fantôme (shadow copy). Pour y accéder, vous devez utiliser l'utilitaire `{command}`.",
    "Un webhook interne est configuré pour se déclencher sur l'appel de `{command}`. Il pourrait révéler des informations.",
    "Les informations ont été obscurcies. Utilisez le dé-obfuscateur `{command}` pour les clarifier."
];

const secretCommandNames = [
    '/exec_payload', '/run_diagnostic', '/decrypt_data', '/query_intel', 
    '/probe_firewall', '/analyze_stream', '/dump_memory', '/get_root_access',
    '/decompile_binary', '/trace_packet', '/restore_snapshot', '/bypass_auth',
    '/inject_sql', '/escalate_privileges', '/read_eeprom', '/force_reboot',
    '/purge_logs', '/connect_backdoor', '/crack_hash', '/resolve_dns',
    '/mount_hidden', '/defrag_fs', '/check_integrity', '/run_exploit',
    '/sniff_traffic', '/fuzz_input', '/bruteforce_ssh', '/pivot_network',
    '/impersonate_user', '/disable_security', '/enable_godmode', '/trigger_race_condition',
    '/overflow_buffer', '/format_string_attack', '/load_kernel_module',
    '/unload_driver', '/patch_memory', '/reverse_shell', '/bind_shell',
    '/clear_audit_log', '/zeroday_exploit', '/scan_vulns', '/get_env',
    '/list_processes', '/kill_process', '/read_registry', '/write_file',
    '/delete_evidence', '/create_user', '/change_password', '/start_service'
];

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateGibberishFile(): FileNode {
    return {
        name: getRandomElement(randomFileNames),
        type: 'file',
        content: getRandomElement(gibberishContent),
    };
}

function generateRandomFolder(depth: number, maxDepth: number, numFiles: number): FileNode {
    const folderName = getRandomElement(randomFolderNames.filter(n => n !== 'system32' && n !== 'logs'));
    const folder: FileNode = {
        name: folderName,
        type: 'folder',
        children: [],
    };
    
    if (depth < maxDepth) {
        const numChildren = Math.floor(Math.random() * 4) + 1;
        for (let i = 0; i < numChildren; i++) {
            const isFolder = Math.random() > 0.6 && depth < maxDepth - 1;
            if (isFolder) {
                folder.children?.push(generateRandomFolder(depth + 1, maxDepth, numFiles));
            } else if ((folder.children?.length ?? 0) < numFiles) {
                folder.children?.push(generateGibberishFile());
            }
        }
    }
    return folder;
}

function getAllFiles(node: FileNode, path: string): {path: string, file: FileNode}[] {
    let files: {path: string, file: FileNode}[] = [];
    const currentPath = path === '/' ? '' : path;

    if (node.type === 'file') {
        files.push({ path: `${currentPath}/${node.name}`, file: node });
    } else if (node.children) {
        for (const child of node.children) {
            files = files.concat(getAllFiles(child, `${currentPath}/${node.name}`.replace('//', '/')));
        }
    }
    return files;
}

export function generateFileSystem(password: string, level: number): { fileSystem: FileNode; clues: Clue[] } {
    // Difficulty scaling: less files and less depth for lower levels.
    const maxDepth = Math.floor(level / 2) + 1;
    const numFiles = 4 + level * 3; // Ensure enough files for password clues + some decoys.

    const fileSystem: FileNode = { name: '/', type: 'folder', children: [] };
    
    fileSystem.children?.push({ name: 'system32', type: 'folder', children: [generateGibberishFile()] });
    fileSystem.children?.push({ name: 'logs', type: 'folder', children: [generateGibberishFile()] });
    fileSystem.children?.push(generateGibberishFile());

    while(getAllFiles(fileSystem, '/').length < numFiles) {
        const isFolder = Math.random() > 0.5;
        if(isFolder) {
            fileSystem.children?.push(generateRandomFolder(1, maxDepth, numFiles));
        } else {
            fileSystem.children?.push(generateGibberishFile());
        }
    }

    const allFiles = getAllFiles(fileSystem, '/');
    const clues: Clue[] = [];
    const passwordChars = password.split('');
    const usedFileIndices = new Set<number>();

    // Ensure every password character has a corresponding clue
    for (let i = 0; i < passwordChars.length; i++) {
        if (allFiles.length <= usedFileIndices.size) break; 
        
        const charIndex = i;
        const passwordChar = passwordChars[charIndex];

        // Chance of a clue being "chained" (requiring a console command) increases with level.
        const chanceOfChainedClue = Math.max(0, (level - 2) * 0.15); // Starts at L3, caps at 60% for L6
        const isChainedClue = level > 2 && Math.random() < chanceOfChainedClue;
        
        if (isChainedClue && allFiles.length > usedFileIndices.size + 1) {
            // --- Chained Clue Logic (File -> Console Command -> Clue) ---
            const secretCommand = `${getRandomElement(secretCommandNames)}`;
            const clueTemplate = getRandomElement(clueContentTemplates);
            const commandOutput = clueTemplate
                .replace('{char}', passwordChar)
                .replace('{index}', (charIndex + 1).toString())
                .replace('{randomHex}', (Math.floor(Math.random() * 0xFFFFFF)).toString(16).padStart(6, '0'))
                .replace(/{randomGibberish}/g, Math.random().toString(36).substring(2, 8));

            let pointerFileIndex;
            do {
                pointerFileIndex = Math.floor(Math.random() * allFiles.length);
            } while (usedFileIndices.has(pointerFileIndex));
            usedFileIndices.add(pointerFileIndex);
            const pointerFile = allFiles[pointerFileIndex];

            const pointerTemplate = getRandomElement(chainedCluePointerTemplates);
            pointerFile.file.content += `\n\n[SYSTEM NOTIFICATION] ${pointerTemplate.replace('{command}', secretCommand)}`;

            const hintTemplate = getRandomElement(botHintTemplates);
            const hintDir = pointerFile.path.substring(0, pointerFile.path.lastIndexOf('/')) || '/';
            const botHint = hintTemplate
                .replace('{filepath}', pointerFile.path)
                .replace('{dir}', hintDir)
                .replace('{filename}', pointerFile.file.name);
            
            clues.push({
                type: 'console',
                hint: botHint,
                location: pointerFile.path,
                command: secretCommand,
                commandOutput: commandOutput
            });

        } else {
            // --- Simple Clue Logic (File -> Clue) ---
            let clueFileIndex;
            do {
                clueFileIndex = Math.floor(Math.random() * allFiles.length);
            } while (usedFileIndices.has(clueFileIndex));
            usedFileIndices.add(clueFileIndex);
            const clueFile = allFiles[clueFileIndex];

            const clueTemplate = getRandomElement(clueContentTemplates);
            const clueText = clueTemplate
                .replace('{char}', passwordChar)
                .replace('{index}', (charIndex + 1).toString())
                .replace('{randomHex}', (Math.floor(Math.random() * 0xFFFFFF)).toString(16).padStart(6, '0'))
                .replace(/{randomGibberish}/g, Math.random().toString(36).substring(2, 8));

            clueFile.file.content += `\n\n<!-- ${clueText} -->`;

            const hintTemplate = getRandomElement(botHintTemplates);
            const hintDir = clueFile.path.substring(0, clueFile.path.lastIndexOf('/')) || '/';
            const botHint = hintTemplate
                .replace('{filepath}', clueFile.path)
                .replace('{dir}', hintDir)
                .replace('{filename}', clueFile.file.name);

            clues.push({
                type: 'file',
                hint: botHint,
                location: clueFile.path,
            });
        }
    }
    
    if (level > 4 && getPasswordSettingsForLevel(level).includeSpecialChars) {
        clues.push({
            type: 'general',
            hint: 'La politique de sécurité semble avoir été mise à jour récemment. Les mots de passe requièrent peut-être des caractères spéciaux.'
        });
    }

    // Shuffle clues to make their order unpredictable
    for (let i = clues.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [clues[i], clues[j]] = [clues[j], clues[i]];
    }

    return { fileSystem, clues };
}
