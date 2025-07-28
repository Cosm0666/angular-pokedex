import { Component } from '@angular/core';
import { PokemonComponent } from './pokemon/pokemon.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TabListComponentComponent } from './tab-list-component/tab-list-component.component';


@Component({
  selector: 'app-root',
  imports: [PokemonComponent, TabListComponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pokedex-angular';
}
