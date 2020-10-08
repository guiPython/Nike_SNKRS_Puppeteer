async function retry ( promise , nRetry ){
    try{
        return await promise()
    }
    catch(error){
        if ( nRetry <= 0 ){
            throw error
        }
        return await retry( promise , nRetry - 1 )
    }
}

module.exports = retry