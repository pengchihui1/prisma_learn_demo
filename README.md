
## 起始
mkdir hello-prisma 
cd hello-prisma
npm init -y 
npm install prisma typescript ts-node @types/node --save-dev

## .env定义数据库连接
DATABASE_URL="postgres://postgres@localhost:5432/prisma_test"

## prisma/schema.prisma数据库表格映射字段
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String   @db.VarChar(255)
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}

model Profile {
  id     Int     @id @default(autoincrement())
  bio    String?
  user   User    @relation(fields: [userId], references: [id])
  userId Int     @unique
}

model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String?
  posts   Post[]
  profile Profile?
}

## prisma创建表
npx prisma migrate dev --name init

## Prisma 客户端
npm install @prisma/client

## node文件（index.ts）
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

  await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
      posts: {
        create: { title: 'Hello World' },
      },
      profile: {
        create: { bio: 'I like turtles' },
      },
    },
  })

  // ... you will write your Prisma Client queries here
  const allUsers = await prisma.user.findMany()
  console.log(allUsers)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

## 常用方法

## 运行node写入数据库
npx ts-node index.ts

# 资料档案
prisma：https://www.prisma.io/


## 注意事项
window下node版本需要控制在16.13.2及以下像版本16.15.1这种高版本会使npm直接爆出一个点的错误

## postgresql
### Prisma Migrate
```
Prisma	PostgreSQL
String	text
Boolean	boolean
Int	integer
BigInt	bigint
Float	double precision
Decimal	decimal(65,30)
DateTime	timestamp(3)
Json	jsonb
Bytes	bytea
```
### Native type mappings
```
PostgreSQL (Type | Aliases)	Prisma	Supported	Native database type attribute	Notes
bigint | int8	BigInt	✔️	@db.BigInt*	*Default mapping for BigInt - no type attribute added to schema.
boolean | bool	Bool	✔️	@db.Boolean*	*Default mapping for Bool - no type attribute added to schema.
timestamp with time zone | timestamptz	DateTime	✔️	@db.Timestamptz(x)	
time without time zone | time	DateTime	✔️	@db.Time(x)	
time with time zone | timetz	DateTime	✔️	@db.Timetz(x)	
numeric(p,s) | decimal(p,s)	Decimal	✔️	@db.Decimal(x, y)	
real | float, float4	Float	✔️	@db.Real	
double precision | float8	Float	✔️	@db.DoublePrecision*	*Default mapping for Float - no type attribute added to schema.
smallint | int2	Int	✔️	@db.SmallInt	
integer | int, int4	Int	✔️	@db.Int*	*Default mapping for Int - no type attribute added to schema.
smallserial | serial2	Int	✔️	@db.SmallInt @default(autoincrement())	
serial | serial4	Int	✔️	@db.Int @default(autoincrement())	
bigserial | serial8	Int	✔️	@db.BigInt @default(autoincrement()	
character(n) | char(n)	String	✔️	@db.Char(x)	
character varying(n) | varchar(n)	String	✔️	@db.VarChar(x)	
money	Decimal	✔️	@db.Money	
text	String	✔️	@db.Text*	*Default mapping for String - no type attribute added to schema.
timestamp	DateTime	✔️	@db.TimeStamp*	*Default mapping for DateTime - no type attribute added to schema.
date	DateTime	✔️	@db.Date	
enum	Enum	✔️	N/A	
inet	String	✔️	@db.Inet	
bit(n)	String	✔️	@Bit(x)	
bit varying(n)	String	✔️	@VarBit	
oid	Int	✔️	@db.Oid	
uuid	String	✔️	@db.Uuid	
json	Json	✔️	@db.Json	
jsonb	Json	✔️	@db.JsonB*	*Default mapping for Json - no type attribute added to schema.
bytea	Bytes	✔️	@db.ByteA*	*Default mapping for Bytes - no type attribute added to schema.
xml	String	✔️	@db.Xml	
Array types	[]	✔️		
citext	String	✔️*	@db.Citext	* Only available if Citext extension is enabled.
interval	Unsupported	Not yet		
cidr	Unsupported	Not yet		
macaddr	Unsupported	Not yet		
tsvector	Unsupported	Not yet		
tsquery	Unsupported	Not yet		
int4range	Unsupported	Not yet		
int8range	Unsupported	Not yet		
numrange	Unsupported	Not yet		
tsrange	Unsupported	Not yet		
tstzrange	Unsupported	Not yet		
daterange	Unsupported	Not yet		
point	Unsupported	Not yet		
line	Unsupported	Not yet		
lseg	Unsupported	Not yet		
box	Unsupported	Not yet		
path	Unsupported	Not yet		
polygon	Unsupported	Not yet		
circle	Unsupported	Not yet		
Composite types	n/a	Not yet		
Domain types	n/a	Not yet	
```

## mysql
### Prisma Migrate
Data model	MySQL	Notes
String	VARCHAR(191)	
Boolean	BOOLEAN	In MySQL BOOLEAN is a synonym for TINYINT(1)
Int	INT	
BigInt	BIGINT	
Float	DOUBLE	
Decimal	DECIMAL(65,30)	
DateTime	DATETIME(3)	
Json	JSON	Supported in MySQL 5.7+ only
Bytes	LONGBLOB	

### Native type mappings
MySQL	Prisma	Supported	Native database type attribute	Notes
serial	BigInt	✔️	@db.UnsignedBigInt @default(autoincrement())	
bigint	BigInt	✔️	@db.BigInt	
bigint unsigned	BigInt	✔️	@db.UnsignedBigInt	
bit	Bytes	✔️	@db.Bit(x)	bit(1) maps to Boolean - all other bit(x) map to Bytes
boolean | tinyint(1)	Boolean	✔️	@db.TinyInt(1)	
varbinary	Bytes	✔️	@db.VarBinary	
longblob	Bytes	✔️	@db.LongBlob	
tinyblob	Bytes	✔️	@db.TinyBlob	
mediumblob	Bytes	✔️	@db.MediumBlob	
blob	Bytes	✔️	@db.Blob	
binary	Bytes	✔️	@db.Binary	
date	DateTime	✔️	@db.Date	
datetime	DateTime	✔️	@db.DateTime	
timestamp	DateTime	✔️	@db.TimeStamp	
time	DateTime	✔️	@db.Time	
decimal(a,b)	Decimal	✔️	@db.Decimal(x,y)	
numeric(a,b)	Decimal	✔️	@db.Decimal(x,y)	
enum	Enum	✔️	N/A	
float	Float	✔️	@db.Float	
double	Float	✔️	@db.Double	
smallint	Int	✔️	@db.SmallInt	
smallint unsigned	Int	✔️	@db.UnsignedSmallInt	
mediumint	Int	✔️	@db.MediumInt	
mediumint unsigned	Int	✔️	@db.UnsignedMediumInt	
int	Int	✔️	@db.Int	
int unsigned	Int	✔️	@db.UnsignedInt	
tinyint	Int	✔️	@db.TinyInt(x)	tinyint(1) maps to Boolean all other tinyint(x) map to Int
tinyint unsigned	Int	✔️	@db.UnsignedTinyInt(x)	tinyint(1) unsigned does not map to Boolean
year	Int	✔️	@db.Year	
json	Json	✔️	@db.Json	Supported in MySQL 5.7+ only
char	String	✔️	@db.Char(x)	
varchar	String	✔️	@db.VarChar(x)	
tinytext	String	✔️	@db.TinyText	
text	String	✔️	@db.Text	
mediumtext	String	✔️	@db.MediumText	
longtext	String	✔️	@db.LongText	
set	Unsupported	Not yet		
geometry	Unsupported	Not yet		
point	Unsupported	Not yet		
linestring	Unsupported	Not yet		
polygon	Unsupported	Not yet		
multipoint	Unsupported	Not yet		
multilinestring	Unsupported	Not yet		
multipolygon	Unsupported	Not yet		
geometrycollection	Unsupported	Not yet	