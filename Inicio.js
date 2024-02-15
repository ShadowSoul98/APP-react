import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image,List, Button, AsyncStorage, FlatList, ImageBackground } from 'react-native';
import {NavigationContext} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import MenuDrawer from 'react-native-side-drawer';
import * as ImagePicker from 'react-native-image-picker';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';


const styles = StyleSheet.create({
  texto1:{
    fontSize:20,
    height: 80,
    width:180,
    marginLeft:80,
    marginTop:0,
    color: "#000000",
},
  foto1: {
    width: 76, 
    height: 76,
    marginLeft:86,
    marginTop: 10,
},
foto2: {
  width: 76, 
  height: 76,
  marginLeft:10,
  marginTop: 10,
},
  lista:{
    marginTop: 113,
},
  mod:{
    width:40,
    height:33,
    marginHorizontal: 342,
    marginTop: 18,
    backgroundColor: '#00000000',
},
  back:{
    height:780,
    marginLeft:0,
},
////////////////////////////////////////////////////////
    nom: {
        fontSize:16,
    },
    container: {
      flex: 1,
      backgroundColor: "#ffffff",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 30,
      zIndex: 0
    },
    animatedBox: {    
      backgroundColor: "#00008888",
      padding: 10
    },
    body: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F04812'
    },
    foto: {
      width: 140, 
      height: 140,
    },
    container1: {
      flex: 1,
      flexDirection: "column",
    },
    //////////////////////////////////////////////////////////////
  texto2:{
    fontSize:20,
    height: 80,
    width:180,
    marginLeft:10,
    marginTop:0,
    color: "#000000",
  },
  texto3:{
      backgroundColor: "rgba(0,0,0,0.5)",
      color:"#99ffff",
  },
  image: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center",
  },
  
  bit:{
    width:200,
    height:40,
    marginLeft:100
  },
  })

export default class inicio extends Component {
    static contextType = NavigationContext;
    constructor(props){
        super(props);
        this.state={
            open: false,
            resourcePath:{},
            id:[],
            selectedIndex: 2,
            //estos 5 funcionan para actualizar 
            loading: false,
            page: 1,
            seed: 1,
            error:null,
            refreshing: false,
            ////////////////////////////////
            _id:[],
        };
        this.updateIndex = this.updateIndex.bind(this)
    };
    updateIndex (selectedIndex) {
      this.setState({selectedIndex})
    }

    traeDatos =  async (ruta) =>{
      const valor = await AsyncStorage.getItem('elementos');
      var datos = JSON.parse(valor);
      console.log("datos: "+datos[0]);
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
        }
      };
      xhttp.open('GET', 'https://gradational-gold.000webhostapp.com/CambiaImagen.php?codigo='+datos[0]+"&rutai="+ruta, true);// todo va en una sola linea.
      xhttp.send();
    }
    
    componentDidMount(){
      this.imageni();
      this.leeJSON();
      this.getUsed();
    }

    getUsed =  async () =>{
      const valor = await AsyncStorage.getItem('elementos');
      var datos = JSON.parse(valor);
      var xhttp = new XMLHttpRequest();
      let _this = this;
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              // Typical action to be performed when the document is ready:
              var temp = JSON.parse(xhttp.responseText);
              _this.setState({_id: temp});
              console.log("JSON DEL PERFIL: "+_id);
              datos[0]=1;
          }
      };
      xhttp.open(
          "GET",
          "https://gradational-gold.000webhostapp.com/Profile.php?codigo="+datos[0],
          true,
      );
      xhttp.send();
      ////todo lo que resta del codigo es para la funcion de actualizar 

      //pon tu link
      const url = "https://gradational-gold.000webhostapp.com/Rank.php?codigo="+datos[0];
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

    imageni= async ()=>{
        let _this= this;
        var urli = await AsyncStorage.getItem('urlImagen');
        if(urli == null){
          return;
        }
        else{
          //_this.setState( resourcePath.uri  = urli);
          _this.setState({resourcePath: JSON.parse(urli)}); 
          //COmentario
        }
    }
    ///JSON
    leeJSON =  async (ruta) =>{
      const valor = await AsyncStorage.getItem('elementos');
      var datos = JSON.parse(valor);
      var xhttp = new XMLHttpRequest();
      let _this = this;
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              // Typical action to be performed when the document is ready:
              var temp = JSON.parse(xhttp.responseText);
              _this.setState({id: temp});
              datos[0]=1;
          }
      };
      xhttp.open(
          "GET",
          "https://gradational-gold.000webhostapp.com/Rank.php?codigo="+datos[0],
          true,
      );
      xhttp.send();

      ////todo lo que resta del codigo es para la funcion de actualizar 

      //pon tu link
      const url = "https://gradational-gold.000webhostapp.com/Rank.php?codigo="+datos[0];
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
      this.getUsed();
    })
  }

    uploadImageServer=async()=>{
        const response = await fetch(this.state.resourcePath.uri);
        const blob = await response.blob();
        var reader = new FileReader();
        reader.onload=()=>{
            var InsertAPI= 'https://gradational-gold.000webhostapp.com/upload.php';
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
                var ruta="https://gradational-gold.000webhostapp.com/"+response;
                this.traeDatos(ruta);
            }).catch(err=>{console.log(err);})
        }
        reader.readAsDataURL(blob);
    }
        //ass
//asd
    _cerrar = async()=>{
        const valor = await AsyncStorage.removeItem('elementos');
        const navigation = this.context;
        navigation.navigate('Login');
    }

    toggleOpen = () => {
        this.setState({ open: !this.state.open });
    };
     
    drawerContent = () => {
        function Nombre(){
            const route = useRoute();
            var name = route.params.cadena.split(",");
            return <Text>{name[2]}</Text>
        }
        const navigation = this.context;
        const Profile=() => {
          navigation.navigate('Profile');
        }
        const { selectedIndex } = this.state
        return (
            <View
            
            backgroundColor= "#00000066"
            >
              <FlatList
                    data={this.state._id}   
                    keyExtractor={item => item._id}            
                    renderItem={({item})=>(
                        <View >
                            <ImageBackground source={{ uri: item.imagen}}
                            style={styles.foto2}>
                            </ImageBackground>
                            <Text style={styles.texto2}>{item.Nombre}</Text>
                        </View>
                    )}
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                ></FlatList>
                <Button
                  color="#00000088"
                  title="Perfil"
                  onPress={Profile}
                  />
                <Button
                    onPress={() =>
                        ImagePicker.launchImageLibrary(
                          {
                            mediaType: 'photo',
                            includeBase64: false,
                            maxHeight: 90,
                            maxWidth: 90,
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
                            this.uploadImageServer()
                          },
                          
                        ) 
                      }
                    title="Selecciona imagen"
                    
                />
              
                <Nombre/>
                <TouchableOpacity 
                    onPress={this.toggleOpen} 
                    style={styles.animatedBox}>
                <Text>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this._cerrar} 
                    style={styles.animatedBox}>
                <Text>Cerrar Secion</Text>
                </TouchableOpacity>
                
            </View>
        );
      };//asd
    
      render() {
        //el const que te hara cambiar de pagina
        //esto se pone en inicio
        const navigation = this.context;
        const Profile=() => {
          navigation.navigate('Profile');
        }
        const { selectedIndex } = this.state
        return (
          <ImageBackground 
            source={require('./imagenes/inicio.png')}
            style={styles.back}
          >
            <MenuDrawer
            open={this.state.open} 
            drawerContent={this.drawerContent()}
            drawerPercentage={45}
            animationTime={250}
            overlay={true}
            opacity={0.4} 
            />
            <View>
              <TouchableOpacity
                style={styles.mod}
                onPress={this.toggleOpen}
              />
            </View>
            
            <FlatList
                    style={styles.lista}
                    data={this.state.id}
                    keyExtractor={item => item.id}                    
                    renderItem={({item})=>(
                        <View >
                            <ImageBackground source={{ uri: item.imagen}}
                            style={styles.foto1}>
                              <Text style={styles.texto1}>{item.Nombre}</Text>
                            </ImageBackground>
                        </View>
                    )}
                    refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
                ></FlatList>
                <View>
                
                </View>
          </ImageBackground>
        );//con el onPress ejecuta el cambio de 
        //  pagina
    }
}//asdsadasdasd