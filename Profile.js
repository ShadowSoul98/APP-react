import React, { Component } from 'react';
import { Text, Modal, View, StyleSheet, AsyncStorage,ImageBackground, FlatList, ProgressBarAndroid,Image} from 'react-native';
import {NavigationContext} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';
import * as ImagePicker from 'react-native-image-picker';
import { Alert } from 'react-native';

export default class profile extends Component {
    static contextType = NavigationContext;
    constructor (props){
        super(props);
        this.state={
          id:[],
          //estos 5 funcionan para actualizar 
          loading: false,
          page: 1,
          seed: 1,
          error:null,
          refreshing: false,
        };
    }
    //ejecuta la funcion al entrar
    componentDidMount(){
      this.leeJSON();
    }
    //lee el JSON que tiene tu informacion
    leeJSON =  async () =>{
      const valor = await AsyncStorage.getItem('elementos');
      var datos = JSON.parse(valor);
      console.log("datos: "+datos[0]);
      console.log("datos: "+datos[1]);
      var xhttp = new XMLHttpRequest();
      let _this = this;
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              // Typical action to be performed when the document is ready:
              console.log (xhttp.responseText);
              var temp = JSON.parse(xhttp.responseText);
              _this.setState({id: temp});
              console.log(datos[0]);
              datos[0]=1;
          }
      };
      xhttp.open(
          "GET",
          "https://gradational-gold.000webhostapp.com/Profile.php?codigo="+datos[0],
          true,
      );
      console.log ("https://gradational-gold.000webhostapp.com/Profile.php?codigo="+datos[0]);
      xhttp.send();

      ////todo lo que resta del codigo es para la funcion de actualizar 

      //pon tu link
      const url = "https://gradational-gold.000webhostapp.com/Profile.php?codigo="+datos[0];
      this.setState({loading:true});
      fetch(url)
      .then(temp=> temp.json())
      .then(temp=>{
        this.setState({
          data: temp.results||[],
          error: temp.error||null,
          loading: false,
          refreshing: false,
        })
        .catch(error=>{
          this.setState({error, loading:false, refreshing: false,});
        })
      })
  }
  handleRefresh=()=>{
    this.setState({
      page:1,
      refreshing:true,
      seed: this.state.seed + 1,
    },()=>{
      //nombre de la funcion que actualizas
      this.leeJSON();
    })
  }

  uploadImageServer=async()=>{
    const response = await fetch(this.state.resourcePath.uri);
    const blob = await response.blob();
    var reader = new FileReader();
    reader.onload=()=>{
        var InsertAPI= 'https://gradational-gold.000webhostapp.com/uploadcheck.php';
        console.log(reader.result);
        var Data={img:reader.result};
        var headers={
            'Accept':'application/json',
            'Content-Type':'application.json'
        }
        fetch(InsertAPI,{
            method:'POST',
            headers:headers,
            body:JSON.stringify(Data),
        }).then((response)=>response.json()).then((response)=>{
            console.log(response)
            var ruta="https://gradational-gold.000webhostapp.com/"+response;
            console.log("rutas: "+ruta);
            this.progreso(ruta);
        }).catch(err=>{console.log(err);})
    }
    reader.readAsDataURL(blob);
}

  progreso =  async (ruta) =>{
    const valor = await AsyncStorage.getItem('elementos');
    var datos = JSON.parse(valor);
    console.log("datos: "+datos[1]);
    console.log("rutas: "+ruta);
    var xhttp = new XMLHttpRequest();
    let _this = this;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            console.log (xhttp.responseText);
            var temp = JSON.parse(xhttp.responseText);
            _this.setState({id: temp});
            console.log(datos[0]);
            datos[0]=1;
        }
    };
    xhttp.open(
        "GET",
        "https://gradational-gold.000webhostapp.com/refrech.php?codigo="+datos[0]+"&metros="+this.state.metros+'&tiempo='+this.state.tiempo+'&ruta='+ruta,
        true,
    );
    Alert.alert("La informacion fue enviada, esperando su validacion");
    console.log ("https://gradational-gold.000webhostapp.com/refrech.php?codigo="+datos[0]+"&metros="+this.state.metros+'&tiempo='+this.state.tiempo+'&ruta='+ruta);
    xhttp.send();
  }

    render() {
        return (
            <ImageBackground 
                source={require('./imagenes/perfil.png')}
                style={styles.imageB}
                >
                  <Image
                source={require('./imagenes/cucei.png')}
                style={styles.image}
                resizeMode="contain"
                />
                
            <FlatList
              data={this.state.id}
              keyExtractor={item => item.id}                    
              renderItem={({item})=>(
                
                <View style={styles.lista}>
                  <ImageBackground source={{ uri: item.imagen}}
                      style={styles.foto1}>
                  </ImageBackground>
                  <View
                  style={styles.texto2}
                  >
                  <Text fontSize="20" >{item.date}                                dias                          10</Text>
                  <ProgressBarAndroid
                  color="#888800"
                    styleAttr="Horizontal"
                    indeterminate={false}
                    progress={item.date/10}
                  />
                  <Text>{item.Distancia/1000}                          Km                          10</Text>
                  <ProgressBarAndroid
                    color="#888800"
                    styleAttr="Horizontal"
                    indeterminate={false}
                    progress={item.Distancia/10000}
                  />
                  <Text>                          posision: {item.lap}/{item.player}</Text>
                  
                  </View>
                  
                </View>
              )}
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
            />
            <Button
                  color="#00000088"
                  title="Progreso"
                  onPress={()=>{this.setState({show:true})}}
                  />
                  <Modal transparent={true}
                  visible={this.state.show}
                  >
                    <View style={styles.modal}>
                      <View style={styles.modal1}>
                        <Text style={{fontSize:20}}> Progreso</Text>
                        <Input
                          placeholder="metros (M)"
                          onChangeText={value => this.setState({metros:value})}
                        />
                        <Input
                          placeholder="minutos (mm:ss)"
                          onChangeText={value => this.setState({tiempo:value})}
                        />
                        <Button
                    onPress={() =>
                        ImagePicker.launchImageLibrary(
                          {
                            mediaType: 'photo',
                            includeBase64: false,
                            maxHeight: 360,
                            maxWidth: 360,
                          },
                          response => {
                          if(response.didCancel== true)
                            {
                              //console.log(response);
                            }
                            else
                            {
                            console.log(response);
                            this.setState({resourcePath: response, data: response.data});
                            console.log("url1: "+ this.state.resourcePath.uri);
                            AsyncStorage.setItem('urlImagen',JSON.stringify (this.state.resourcePath));
                            }
                          },
                        )
                      }
                    title="Selecciona imagen"
                />
                        <Button
                          title="Enviar"
                          color="#00ff00"
                          onPress={this.uploadImageServer}
                          
                        />
                        <Button
                          title="close"
                          onPress={()=>{this.setState({show:false})}}
                        />
                      </View>
                    </View>

                  </Modal>
                </ImageBackground>
            
        )//el refreshing y el onRefresh es para
        //deslizar la pantalla para actualizar
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  example: {
    marginVertical: 24,
  },
  lista:{
    marginTop: 10,
},
texto2:{
  marginLeft: 60,
  width: 270,
},
image:{
  width:350,
  height:350,
  marginLeft:20,
},
imageB:{
  height:780,
  marginLeft:0,
},
foto1: {
  width: 76, 
  height: 76,
  marginHorizontal: 150,
  marginTop: 10,
},
modal:{
  backgroundColor: "#000000aa",
  flex:1,
},
modal1:{
  backgroundColor: "#ffffff",
  margin:50,
  padding:40,
  borderRadius:10,
  flex:1,
},
});
