import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  EvolutionChainResponse,
  PokemonListResponse,
  PokemonResponse,
  PokemonSummary,
} from '../models/pokemon.model';
import { TabListComponentComponent } from '../tab-list-component/tab-list-component.component';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [CommonModule, FormsModule, TabListComponentComponent],
  templateUrl: './pokemon.component.html',
  styleUrl: './pokemon.component.scss',
})
export class PokemonComponent {
  isReseting: boolean = false;
  justReset: boolean = false;
  searched: boolean = false;
  pokemonName: string = '';
  evolutionData?: EvolutionChainResponse;
  pokemonData?: PokemonResponse | null = null;
  

  pokemons: PokemonSummary[] = [];
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
      this.loadInitialPokemonList();
  }
  loadInitialPokemonList(count: number = 30) {

    const maxId = 1020;
    const randomIds = Array.from(
      { length: count },
      () => Math.floor(Math.random() * maxId) + 1
    );

    const requests = randomIds.map((id) =>
      this.http
        .get<PokemonResponse>(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .pipe(
          map((poke) => ({
            name: poke.name,
            image: poke.sprites.other['official-artwork'].front_default,
          }))
        )
    );

    forkJoin(requests).subscribe((list) => {
      this.pokemons = list;
    });
  }

  resetSearch() {
    this.isReseting = true;

    setTimeout(() => {
      this.searched = false;
      this.pokemonName = '';
      this.pokemonData = null;
      this.isReseting = false;
      document.body.style.backgroundColor = 'white';
    }, 400);
  }

  formatId(id: number): string {
    return id.toString().padStart(3, '0');
  }

  typeColor: Record<string, string> = {
    fire: '#e67e22',
    water: '#3498db',
    electric: '#dab216ff',
    grass: '#3cd47bff',
    normal: '#95a5a6',
    poison: '#a040a0',
    bug: '#9acd32',
    ground: '#d2b48c',
    default: '#34495e',
  };

  capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  getTypeColor(type: string): string {
    return this.typeColor[type] || this.typeColor['default'];
  }

  search() {
    const nomeFormatado = this.pokemonName.trim().toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${nomeFormatado}`;

    this.http.get<PokemonResponse>(url).subscribe({
      next: (data) => {
        this.pokemonData = data;
        this.searched = true;

        const type = data.types[0].type.name;
        const cor = this.typeColor[type] || this.typeColor['default'];
        document.body.style.backgroundColor = cor;
      },
      error: () => {
        this.pokemonData = undefined;
        this.searched = false;
      },
    });
  }
}
