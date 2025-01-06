import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  darkTheme: boolean = false;
  title = 'devapp';


  checkToggle(){
    let element = document.getElementById("body");
    console.log(element);
  }
}
