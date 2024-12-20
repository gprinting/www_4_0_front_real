#! /usr/local/php/bin/php
<?php
$d = new DateTime();
echo str_pad(dechex(crc32('46')), 8, '0', STR_PAD_LEFT) . '_' .  $d->format("ymdHis");
?>
