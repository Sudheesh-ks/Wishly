try {
    require('express');
    console.log('express ok');
    require('mongoose');
    console.log('mongoose ok');
    require('passport');
    console.log('passport ok');
    require('cors');
    console.log('cors ok');
    require('jsonwebtoken');
    console.log('jwt ok');
    require('dotenv');
    console.log('dotenv ok');
    require('passport-google-oauth20');
    console.log('passport-google-oauth20 ok');
} catch (e) {
    console.error(e);
}
