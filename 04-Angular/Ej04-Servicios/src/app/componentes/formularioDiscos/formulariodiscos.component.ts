import { Component, OnInit } from '@angular/core';
import { Disco } from 'src/app/entidades/disco';
import { ServicioDiscos } from 'src/app/servicios/servicioDiscos';

@Component({
  selector: 'app-formulariodiscos',
  templateUrl: './formulariodiscos.component.html',
  //providers: [ ServicioDiscos ],
})
export class FormularioDiscosComponent implements OnInit {

  public disco:Disco = new Disco(0)

  constructor(private servicioDiscos:ServicioDiscos) { 
    console.log("instanciando FormularioDiscosComponent")
  }

  ngOnInit(): void {
  }
  
  public insertar():void{
    console.log("Insertando...")
    this.servicioDiscos.insertar(this.disco)
    //navegar
  }

  public modificar():void{
    console.log("Modificando...")

    this.vaciar()
  }

  public borrar():void{
    console.log("Borrando...")

    this.vaciar()
  }

  public vaciar():void{
    console.log("Vaciando...")     
    this.disco = new Disco(0)
  }

}