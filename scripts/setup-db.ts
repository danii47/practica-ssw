import { execSync } from 'child_process';

function run(cmd: string) {
  console.log(`\n▸ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

async function main() {
  console.log('🔧 Inicializando base de datos…');

  run('npx prisma generate');
  run('npx prisma db push --accept-data-loss');
  run('npx tsx prisma/seed.ts');

  console.log('\n✅ Base de datos inicializada correctamente.');
}

main().catch((e) => {
  console.error('❌ Error al inicializar la base de datos:', e);
  process.exit(1);
});
