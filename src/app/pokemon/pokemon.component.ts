import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  HostListener,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  EvolutionChainResponse,
  PokemonListResponse,
  PokemonResponse,
  PokemonSummary,
} from '../models/pokemon.model';
import { TabListComponentComponent } from '../tab-list-component/tab-list-component.component';
import { concatMap, forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [CommonModule, FormsModule, TabListComponentComponent],
  templateUrl: './pokemon.component.html',
  styleUrl: './pokemon.component.scss',
})
export class PokemonComponent implements AfterViewInit {
  isReseting: boolean = false;
  justReset: boolean = false;
  searched: boolean = false;
  pokemonName: string = '';
  evolutionData?: EvolutionChainResponse;
  pokemonData?: PokemonResponse | null = null;

  pokemons: PokemonSummary[] = [];
  nextUrl: string = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=18';
  isLoading: boolean = false;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.loadNextPage();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY || window.pageYOffset;
    const bodyHeight = document.body.scrollHeight;
    if (scrollY + windowHeight + 300 >= bodyHeight) {
      this.loadNextPage();
    }
  }

  loadNextPage(): void {
    if (!this.nextUrl || this.isLoading) return;

    this.isLoading = true;

    this.http.get<PokemonListResponse>(this.nextUrl).pipe(
      concatMap(res => {
        this.nextUrl = res.next;

        return forkJoin(
          res.results.map(p =>
            this.http.get<PokemonResponse>(p.url).pipe(
              map(data => ({
                name: data.name,
                image: data.sprites.other['official-artwork'].front_default,
                types: data.types.map(t=> t.type.name),
              }))
            )
          )
        );
      })
    ).subscribe(pokemons => {
      this.pokemons.push(...pokemons);
      this.isLoading = false;
    });
  }

  resetSearch() {
    this.searched = false;
    this.pokemonName = '';
    this.pokemonData = null;
    document.body.style.backgroundColor = 'white';
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
        window.scrollTo({ top: 0, behavior: 'smooth' });


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
