import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { CountriesService } from '../../services/countries.service';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrl: './selector-page.component.css'
})
export class SelectorPageComponent implements OnInit{

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService,
  ) {}

  public regions: Region[] = [];
  public countriesByRegion: SmallCountry[] = [];
  public borders: SmallCountry[] = [];

  public myForm: FormGroup = this.fb.group({
    region: ["", Validators.required],
    country: ["", Validators.required],
    border: ["", Validators.required]
  })

  ngOnInit(): void {
    this.regions = this.countriesService.getRegions();
    this.onRegionChanged();
    this.onCountryChanged();
  }

  onRegionChanged(): void {
    this.myForm.get('region')!.valueChanges.
    pipe(
      /* Si cambia un país se setea el conuntry a vacío */
      tap(() => this.myForm.get('country')?.setValue("")),
      tap(() => this.borders = []),
      switchMap(region => this.countriesService.getCountries(region))
    )
    .subscribe( response => {
      this.countriesByRegion = response;
      console.log(this.countriesByRegion, "countries");
    })
  }

  onCountryChanged(): void {
    this.myForm.get('country')!.valueChanges.
    pipe(
      tap(() => this.myForm.get('border')?.setValue("")),
      /* Si el filtro no es TRUE no hace la petición http */
      filter((value: string) => value.length > 0),
      switchMap(alphacode => this.countriesService.getCountryByAlphaCode(alphacode)),
      switchMap(country => this.countriesService.getCountriesBordersByCodes(country.borders)),
      tap((borders) => this.borderRequired(borders))
    )
    .subscribe( response => {
      this.borders = response;
      console.log(response, " response borders");
      /* this.borders = response.sort((a, b) =>
        a.name.localeCompare(b.name)
      ) */
    })
  }

  borderRequired(hayBorders: SmallCountry[]): void {
    // Luego, en tu función donde decides si se requiere o no el campo
    if (hayBorders.length === 0) {
      // Si no hay borders, quita el validador
      this.myForm.get('border')!.setValidators([]);
      this.myForm.get('border')!.updateValueAndValidity();
    } else {
      // Si hay borders, agrega el validador
      this.myForm.get('border')!.setValidators([Validators.required]);
      this.myForm.get('border')!.updateValueAndValidity();
    }
  }




}
