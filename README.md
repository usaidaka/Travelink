# Travelink

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709714635/q7nuk0bkpf1ks3jhzsgc.png)
Travelink adalah sebuah platform online yang dirancang khusus untuk mempertemukan para pelancong dengan sesama pelancong. Dalam perjalanan, seringkali kita merasa kesepian dan menghadapi kesulitan saat perlu berpartner untuk mengatasi situasi tertentu. Tantangan ini muncul karena sulitnya mengetahui apakah ada pelancong lain di sekitar kita yang juga mencari teman perjalanan. Melalui Travelink, pelancong dapat terhubung dengan sesama pelancong yang berada di sekitar mereka, memungkinkan mereka untuk menjalin hubungan dan berbagi pengalaman perjalanan.

## Installation

Install my-project with npm

```bash
  git clone -url-repository
  cd -this-project
```

lakukan konfigurasi pada .env, untuk variable ENV apa saja yang dibutuhkan pada project kali ini dapat dilihat pada file .env.exp.

Install package in front end

```bash
  cd client
  npm install
  npm run start
```

Install package in back end

```bash
  cd server
  npm install
  npm run start
```

untuk melakukan initialize database. terus jalankan program didalam folder server.

perhatikan config database dan sesuaikan dengan configurasi database di local anda:

```bash
  npx sequelize-cli db:create <- untuk membuat Schema atau database
  npx sequelize-cli db:migrate <- untuk melakukan migrasi tabel
  npx sequelize-cli db:seed:all <- untuk mengisi initial data awal
```

pada repository ini telah tersedia seeder untuk menginitialize data akan tetapi juga sudah dilengkapi dengan query MySQL sehingga dapat dilakukan sql injection nya di folder **database**. anda dapat menggunakannya untuk melakukan initialize data.

## Tech Stack

### Back End

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709713954/cpmfg4ig5ba1myiilco1.png)

| Parameter      | Description                                                               |
| :------------- | :------------------------------------------------------------------------ |
| Node JS        | runtime environment untuk JavaScript runtime environment untuk JavaScript |
| Express JS     | framework                                                                 |
| Sequelize JS   | ORM (Object Relational Mapping)                                           |
| Cloudinary     | layanan penyimpanan file                                                  |
| Redis          | Caching                                                                   |
| Node Mailer    | SMPT (Simple Main Protocol Transfer) pengiriman email                     |
| Multer         | middleware node.js untuk menangani form data                              |
| Joi Validation | Validation BackEnd                                                        |
| MySQL          | Database                                                                  |

`Node JS` : pada website ini Node JS digunakan sebagai runtime environtment tempat dimana code back end ditulis dan dijalankan

`Express JS` : penggunaan Express JS sebagai framework ditujukan agar memudahkan dan mempercepat proses development back end

`Sequelize JS` : penerapan ORM sequelize ditujukan untuk beberapa keperluan. Pertama, agar proses development lebih mudah dikarenakan query yang dimiliki oleh ORM relatif lebih mudah untuk di implement terutama untuk beberapa fungsi JOIN table. selain itu juga ORM dapat dimanfaatkan agar terhindar dari mySQL injection

`Cloudinary` : Memanfaatkan Cloudinary sebagai tempat penyimpanan file sehingga tidak perlu menyimpan file di local dan dapat dg mudah diakses

`Redis` : Implementasi Redis pada website ini digunakan untuk keperluan wrong password 3x. sehingga user tidak dapat melakukan wrong password lenih dari 3x. akan diberikan temporary suspend selama 5 menit

`Node Mailer` : Pengiriman email menggunakan SMTP Node Mailer digunakan dalam proses reset password. ketika user forgot password maka akan menerima email untuk akses reset password beserta dengan OTP (One Time Password)

`Multer` : Middleware untuk menghandle form data sehingga dapat digunakan untuk memasukkan file upload
`Joi Validation` : penerapan validation back end terutama pada request.body perlu dilakukan untuk menghindari adanya invalid payload

`MySQL` : merupakan database yang digunakan pada website ini

### Front End

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709713979/tnfylbscvezgqpmhwd6m.png)

| Parameter       | Description                                                       |
| :-------------- | :---------------------------------------------------------------- |
| ReactJS         | Framework                                                         |
| Redux           | State Management                                                  |
| Redux Saga      | Managing side effect dari state manageemnt                        |
| Axios           | library opensource yang digunakan untuk request data melalui http |
| React Hook Form | validation front end dan form collective registration             |
| Sass            | CSS preproccesor                                                  |
| Material UI     | Styling                                                           |
| React Leaflet   | Library maps                                                      |

`ReactJS`: Library JavaScript untuk membangun antarmuka pengguna yang interaktif.

`Redux`: Library untuk mengelola state aplikasi di React.

`Redux Saga`: Middleware Redux untuk mengelola side effects (misalnya, pemanggilan API) secara asinkron.

`Axios`: Library untuk melakukan pemanggilan HTTP di browser dan Node.js.

`React Hook Form`: Library untuk mengelola formulir di React menggunakan hooks.

`Sass`: Bahasa preprocessor CSS yang memperluas fitur CSS dengan menambahkan variabel, nested rules, mixins, dan lainnya.

`Material UI`: Kumpulan komponen React yang mengimplementasikan desain Material Design.

`React Leaflet`: Pustaka untuk menampilkan peta interaktif di aplikasi React menggunakan Leaflet, sebuah pustaka JavaScript untuk membuat peta interaktif.

# Features

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709714082/dvbjagtifbyqkeujyukn.png)
terdapat 2 fitur utama pada website ini. fitur yang pertama adalah fitur maps dan yang kedua adalah fitur mini social media

### Maps

fitur maps diperuntukan sebagai fitur utama dimana dengan memanfaatkan **reactleaflet** sebagai library maps untuk dapat menampilkan marker location dari user yang sedang melakukan trip. maps pada website ini memudahkan user lain untuk melihat trip yang sedang dilakukan, melihat trip user lain, dan juga mendapatkan informasi nearby, baik nearby current location ataupun nearby direction location

### Mini Social Media

fitur mini social media ini membolehkan user untuk melakukan posting ke halanmannya masing masing untuk memperlihatkan aktifitas nya selama melakukan trip. sehingga user dapat sharing pengalaman tripnya yang menarik. selain itu, user lain pun dapat melakukan comment pada postingan yang tersedia.

# ERD (Entity Relational Diagram)

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709714494/nwnpr8uglzmgpdxcaf57.png)

# User Page

## Register

User yang belum memiliki akun dapat melakukan register di alamat ['/register']. pada halamant ini terdapat 3 step pengisian form. sebagai berikut:

### Register - Step One

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709487894/ko9ervbpiuemolep0ghz.png)
pada form ini user diminta untuk mengisi username, email, password, dan confirm password. jika user belum melengkapi data, maka user tidak dapat beranjak ke step selanjutnya.

### Register - Step Two

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709487894/pnhgw8blk32fcrpcyv2e.png)
pada form ini user diminta untuk mengisi first name, last name, gender, phone, phone contact, dan email contact. phone contact dan email contact dibuat untuk mengantisipasi kontak darurat user sehingga user diminta untuk memasukkan data orang terdekat yang dapat dihubungi. jika user belum melengkapi data, maka user tidak dapat beranjak ke step selanjutnya.

### Register - Step Three

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709487895/qszurest3vqsuezrgk3i.png)
pada form ini user diminta untuk mengisi MBTI. data ini kelak dapat dimanfaatkan untuk setiap user yang ingin pairing atau join group dengan sekumpulan orang dengan mempertimbangkan kecocokan personality mereka masing masing.

## Login

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709487893/ej80iczji1dhwihrleg4.png)
user dapat melakukan login pada page ini menggunakan email dan password.

## Forgot Password

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709487893/psuvqrcpzjfpdowbvsbe.png)
user yang lupa password, dapat menginput emailnya. setelah user menginput emailnya. maka akan menerima email berisikan otp yang hanya berlaku selama 10 menit sejak email diterima.

## Email OTP

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709487891/ymcv1qfxeweerwueihfv.png)
seperti inilah tampilan dari email reset password.

## Reset Password

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709487896/btoijrzrmw5ghdelzyjx.png)
setelah menerima email yang berisikan otp, user dapat melakukan input pada form di page ini. kemudian user akan di redirect ke page login dengan menggunakan password baru yang sudah di reset

## Home

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709487892/en0t5hrhxx4ytxfob2sl.png)
di page home user akan melihat sekumpulan postingan dari dirinya dan juga orang yang di follow. user juga dapat melakukan comment pada setiap post yang ada.

### comment

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709489091/tm5j1bkeiwqiibx6slah.png)
user dapat melihat, menghapus, dan memberi comment melalui form ini

## Explore

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709487893/kjxuivhgdulg1uz2mmuf.png)
page explore berisikan kumpuluan postingan dari semua user. user juga dapat melakukan comment di sini.

## People

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709487892/now7admjm5lsqaaopc7l.png)
di page ini, user dapat melakukan visit profile, follow, unfollow, melihat user lain sedang dalam perjalanan kemana dan sedang dimana. di page inilah user akan bertemu dengan teman teman petualang lainnya.

## Group

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709487894/o2hgwub2lp35xuwrhvhq.png)
user yang sudah memiliki trip atau tujuan, maka diperbolehkan membuat group. user user yang dapat di invite juga adalah user yang memiliki posisi yang dekat dengan user.

## Trip

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709487895/cqd1ss05ssf6nkdntaes.png)
jika user belum memiliki trip. maka user dapat meregistrasikan tripnya disini. user hanya perlu memberi izin kepada website untuk mengakses lokasi terkininya kemudian melakukan search untuk menentukan direction yang ingin dituju.

## Nearby

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709487889/suipspns2ahepkjwofkx.png)
user dapat melihat user user yang berada disekitarnya. baik user yang dekat dengan lokasinya saat ini, maupun user yang berada disekitar titik directionnya nanti. sehingga user dapat menghubungi user yang berada disekitar titik tujuannya.

## Recommendation

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709487889/x1kegr5awusi7zwu827d.png)
jika user masih kebingungan hendak menuju kemana, admin telah menyediakan rekomendasi tujuan yang dapat user pilih. akan ditampilkan pada page ini list list daerah yang recommended untuk dikunjungi.

## Setting

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709487889/cwzgjlozvpjqu0pqllyo.png)
di halaman setting, user dapat mengedit profilenya.

## Profile

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709487890/q6fzh8gku3reihtuzxf8.png)
user dapat berkunjung ke profile nya ataupun profile orang lain. kurang lebih secara tampilan sama saja. bedanya hanya pada profile user, user dapat mengedit dan menghapus postingan. dilain itu, user juga dapat melakukan unfollow dan hapus follower seperti pada gambar berikut :

### Unfollow

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709487896/tb8dddh0whpz0fzagcfg.png)

### Delete Follower

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709487889/g4lw3dcuv8osoobck99i.png)

# Admin Page

selain halaman user, pada website ini juga terdapat halaman admin. sampai pada tulisan ini dibuat, role admin hanya bertugas untuk membuat destination recommendation untuk User

## Dashboard

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709487890/fmuaojr1ovesipszawbw.png)
di dashboard ini ditampilkan data total user, total posting, total trip, dan juga jumlah group. selain itu juga ditampilkan marker keberadaan user.

## Destination

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709487892/wsh3llrkzuir9kz2k7w9.png)
Admin dapat melihat list destination yang sudah dibuat. Pada Popup terdapat opsi untuk melakukan delete atau edit destination

### Delete Destination

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709487891/xmz0wnpl8zzmc0udavw1.png)
admin dapat melakukan delete destination pada page ini

### Register Destination

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709487891/wd0pnujl625pcrklwjva.png)
admin dapat melakukan register destination pada page ini. admin diminta untuk meng input provinsi dan kota. kemudian juga diminta menginput nomor telfon sebagai hotline destinasi yang dituju. detail yang dimaksud adalah catatan lengkap terkait alamat dan lokasi destinasi yang didaftarkan. adapun deskripsi yang diisikan adalah deskripsi terkait lokasi tersebut, terkait informasi, harga, jam buka, parkir, dan sebaginya.

### Edit Destination

![App Screenshot](https://res.cloudinary.com/dgdxx2chz/image/upload/v1709487890/d0q52p3myhzw4fnm8azr.png)
user dapat melakukan edit destinasi di page ini

## API Reference

saya telah melampirkan collection postman pada folder Server. anda dapat melihat dokumentasi backend saya disana lengkap dengan payload yang diminta untuk melakukan suatu request.
