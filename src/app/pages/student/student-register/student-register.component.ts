import {environment} from '../../../../environments/environment';
import {FocusMonitor} from '@angular/cdk/a11y';
import {AsyncPipe, JsonPipe} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  signal,
  untracked,
  viewChild,
  ChangeDetectorRef
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_FORM_FIELD,
  MatFormFieldControl,
  MatFormFieldModule,
} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {Subject} from 'rxjs';
import { NavigationBarComponent } from 'app/pages/home/navigation-bar/navigation-bar.component';
import {MatButtonModule} from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-register',
  templateUrl: 'student-register.component.html',
  styleUrl: 'student-register.component.css',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    forwardRef(() => MyTelInput),
    MatIconModule,
    AsyncPipe,
    JsonPipe,
    MatInputModule,
    NavigationBarComponent,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentRegisterComponent {
  registerEndpoint = `${environment.API_URL}/registration/student`
  formSubmitted = false;
  formSubmissionInProgress = false;
  email_resent = false;
  email_resend_error: boolean = false;
  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    "confirm_password": new FormControl('', [Validators.required]),
    "first_name": new FormControl('', [Validators.required]),
    "last_name": new FormControl(''),
    // "phone_number": new FormControl(''),
    "birth_date": new FormControl(''),
  });
  selectedProfilePicture: File | null = null;
  selectedProfilePictureURI: string | null = null;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  async submitRegisterForm(){
    if (this.form.valid && this.passwordMatchValidator()) {
      this.formSubmissionInProgress = true;
      this.changeDetectorRef.detectChanges();
      const formData = new FormData();
      // Ensure phone_number is treated correctly
      // let phoneNumberValue = this.form.get('phone_number')?.value;
      // let phoneNumberProcessed = {};
      // if (typeof phoneNumberValue === 'object' && phoneNumberValue !== null) {
      //   phoneNumberProcessed = [...Object.values(phoneNumberValue)].join("");
      // } else {
      //   phoneNumberProcessed = phoneNumberValue ? [phoneNumberValue] : [];
      // }
      const student = { ...this.form.value, 
        name: this.form.get('first_name')?.value, 
        surname: this.form.get('last_name')?.value,
        // phone_number: phoneNumberProcessed
      }
      console.log(student);
      delete student.confirm_password
      delete student.first_name
      delete student.last_name
      formData.append('student', new Blob([JSON.stringify(student)], {type: 'application/json'}))
      console.log(formData);
      try {
        const response = await fetch(this.registerEndpoint, 
          {
            method: 'POST',
            body: formData
          })
        console.log("Got response", response);
        if (response.ok) {
          this.formSubmitted = true;
          this.changeDetectorRef.detectChanges();
        } else {
          const error = await response.json()
          alert(error.error);
        }
    } catch (error) {
        console.error(error);
        alert(error);
      } finally{
        this.formSubmissionInProgress = false;
        this.changeDetectorRef.detectChanges();
      }
    } 
  }

  passwordMatchValidator() {
    return this.form.get('password')?.value === this.form.get('confirm_password')?.value
  }

  async resendConfirmationEmail() {
    this.email_resent = false;
    this.email_resend_error = false;
    const email = this.form.get('email')?.value;
    const endpoint = `${environment.API_URL}/registration/resend-confirmation?email=${email}`
    fetch(endpoint, {method: 'GET'}).then(response => {
      if (!response.ok) {
        throw new Error('Failed to resend confirmation email')
      }
      this.email_resent = true;
    }).catch(error => {
      console.error(error);
      this.email_resend_error = true;
    }).finally(() => {
      this.changeDetectorRef.detectChanges();
    })
  }
}
// @Component({
//   selector: 'app-student-register',
//   templateUrl: './student-register.component.html',
//   styleUrl: './student-register.component.css',
//   standalone: true,
//   imports: [MatFormFieldModule, ReactiveFormsModule, FormsModule, forwardRef(() => MyTelInput), MatIconModule, AsyncPipe, JsonPipe ],
//   changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class StudentRegisterComponent {
//   registerEndpoint = `${environment.API_URL}/users/register`
//   registerForm = new FormGroup({
//     email: new FormControl(''),
//     password: new FormControl(''),
//     "first-name": new FormControl(''),
//     "last-name": new FormControl(''),
//     "phone-number": new FormControl(''),
//     "birth-date": new FormControl('')
//   });
//   formSubmitted = false;
//   constructor() {

//   }

//   // async concurrent 
//   async register(){
//     // TODO: Implement register logic
//     const response = await fetch(this.registerEndpoint, 
//       {
//       method: 'POST',
//       body: JSON.stringify(this.registerForm.value),
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     })
//     if (!response.ok) {
//       throw new Error('Failed to register')
//     }
//     this.formSubmitted = true;
//   }
// }

/** Data structure for holding telephone number. */
export class MyTel {
  constructor(
    public area: string,
    public exchange: string,
    public subscriber: string,
  ) {}
}

/** Custom `MatFormFieldControl` for telephone number input. */
@Component({
  selector: 'example-tel-input',
  templateUrl: 'example-tel-input-example.html',
  styleUrl: 'example-tel-input-example.css',
  providers: [{provide: MatFormFieldControl, useExisting: MyTelInput}],
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
  },
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyTelInput implements ControlValueAccessor, MatFormFieldControl<MyTel>, OnDestroy {
  static nextId = 0;
  readonly areaInput = viewChild.required<HTMLInputElement>('area');
  readonly exchangeInput = viewChild.required<HTMLInputElement>('exchange');
  readonly subscriberInput = viewChild.required<HTMLInputElement>('subscriber');
  ngControl = inject(NgControl, {optional: true, self: true});
  readonly parts: FormGroup<{
    area: FormControl<string | null>;
    exchange: FormControl<string | null>;
    subscriber: FormControl<string | null>;
  }>;
  readonly stateChanges = new Subject<void>();
  readonly touched = signal(false);
  readonly controlType = 'example-tel-input';
  readonly id = `example-tel-input-${MyTelInput.nextId++}`;
  readonly _userAriaDescribedBy = input<string>('', {alias: 'aria-describedby'});
  readonly _placeholder = input<string>('', {alias: 'placeholder'});
  readonly _required = input<boolean, unknown>(false, {
    alias: 'required',
    transform: booleanAttribute,
  });
  readonly _disabledByInput = input<boolean, unknown>(false, {
    alias: 'disabled',
    transform: booleanAttribute,
  });
  readonly _value = model<MyTel | null>(null, {alias: 'value'});
  onChange = (_: any) => {};
  onTouched = () => {};

  protected readonly _formField = inject(MAT_FORM_FIELD, {
    optional: true,
  });

  private readonly _focused = signal(false);
  private readonly _disabledByCva = signal(false);
  private readonly _disabled = computed(() => this._disabledByInput() || this._disabledByCva());
  private readonly _focusMonitor = inject(FocusMonitor);
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  get focused(): boolean {
    return this._focused();
  }

  get empty() {
    const {
      value: {area, exchange, subscriber},
    } = this.parts;

    return !area && !exchange && !subscriber;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  get userAriaDescribedBy() {
    return this._userAriaDescribedBy();
  }

  get placeholder(): string {
    return this._placeholder();
  }

  get required(): boolean {
    return this._required();
  }

  get disabled(): boolean {
    return this._disabled();
  }

  get value(): MyTel | null {
    return this._value();
  }

  get errorState(): boolean {
    return this.parts.invalid && this.touched();
  }
  constructor() {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    this.parts = inject(FormBuilder).group({
      area: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      exchange: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      subscriber: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
    });

    effect(() => {
      // Read signals to trigger effect.
      this._placeholder();
      this._required();
      this._disabled();
      // Propagate state changes.
      untracked(() => this.stateChanges.next());
    });

    effect(() => {
      if (this._disabled()) {
        untracked(() => this.parts.disable());
      } else {
        untracked(() => this.parts.enable());
      }
    });

    effect(() => {
      const value = this._value() || new MyTel('', '', '');
      untracked(() => this.parts.setValue(value));
    });

    this.parts.statusChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.stateChanges.next();
    });

    this.parts.valueChanges.pipe(takeUntilDestroyed()).subscribe(value => {
      const tel = this.parts.valid
        ? new MyTel(
            this.parts.value.area || '',
            this.parts.value.exchange || '',
            this.parts.value.subscriber || '',
          )
        : null;
      this._updateValue(tel);
    });
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  onFocusIn() {
    if (!this._focused()) {
      this._focused.set(true);
    }
  }

  onFocusOut(event: FocusEvent) {
    if (!this._elementRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched.set(true);
      this._focused.set(false);
      this.onTouched();
    }
  }

  autoFocusNext(control: AbstractControl, nextElement?: HTMLInputElement): void {
    if (!control.errors && nextElement) {
      this._focusMonitor.focusVia(nextElement, 'program');
    }
  }

  autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
    if (control.value.length < 1) {
      this._focusMonitor.focusVia(prevElement, 'program');
    }
  }

  setDescribedByIds(ids: string[]) {
    const controlElement = this._elementRef.nativeElement.querySelector(
      '.example-tel-input-container',
    )!;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  onContainerClick() {
    if (this.parts.controls.subscriber.valid) {
      this._focusMonitor.focusVia(this.subscriberInput(), 'program');
    } else if (this.parts.controls.exchange.valid) {
      this._focusMonitor.focusVia(this.subscriberInput(), 'program');
    } else if (this.parts.controls.area.valid) {
      this._focusMonitor.focusVia(this.exchangeInput(), 'program');
    } else {
      this._focusMonitor.focusVia(this.areaInput(), 'program');
    }
  }

  writeValue(tel: MyTel | null): void {
    this._updateValue(tel);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabledByCva.set(isDisabled);
  }

  _handleInput(control: AbstractControl, nextElement?: HTMLInputElement): void {
    this.autoFocusNext(control, nextElement);
    this.onChange(this.value);
  }

  private _updateValue(tel: MyTel | null) {
    const current = this._value();
    if (
      tel === current ||
      (tel?.area === current?.area &&
        tel?.exchange === current?.exchange &&
        tel?.subscriber === current?.subscriber)
    ) {
      return;
    }
    this._value.set(tel);
  }
}