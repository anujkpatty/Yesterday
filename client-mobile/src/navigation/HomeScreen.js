import React, { useEffect, useState } from 'react';

import { Text, View, Image } from 'react-native';

function HomeScreen() {

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={{uri: 'http://localhost:3001/gif'}} style = {{width: 900, height: 1200}} />
      </View>
    );
}

export default HomeScreen;