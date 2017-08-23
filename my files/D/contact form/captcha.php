<?php

define('LENGTH', 4); //lenght
define('CHARS', 'abcdefghjklmnpqrstuvwxyz123456789'); //chars
define('FONT', 'font/font1.ttf'); //font with path
define('WIDTH', 150);
define('HEIGHT', 50);
define('FONTSIZE', 27);

session_start();
$seed = str_split(CHARS);
shuffle($seed);
$captchatext = '';
foreach (array_rand($seed, LENGTH) as $k) $captchatext .= $seed[$k];
$_SESSION['captcha'] = $captchatext;
$exp = 2592000 + time();
setcookie(captcha, $_SESSION['captcha'], $exp);
$image = imagecreate(WIDTH, HEIGHT);
$back = imagecolorallocate($image, 255, 255, 255);
$transparent = ImageColorTransparent($image, $back);
$color = imagecolorallocate($image, 0, 0, 0);

imagettftext ($image, FONTSIZE, 1, 3, 38, $color, FONT, $_SESSION['captcha']);
header( 'Expires: Thu, 01 Jan 1980 00:00:00 GMT' );
header( 'Last-Modified: ' . gmdate( 'D, d M Y H:i:s' ) . ' GMT' );
header( 'Cache-Control: no-store, no-cache, must-revalidate' );
header( 'Cache-Control: post-check=0, pre-check=0', false );
header( 'Pragma: no-cache' );
header("Content-type: image/png");
imagepng($image);
?>