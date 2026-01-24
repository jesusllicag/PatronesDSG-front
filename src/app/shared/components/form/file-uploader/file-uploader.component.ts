import { Component, input, output, signal, computed, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface UploadedFile {
  file: File;
  preview?: string;
}

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-uploader.component.html',
})
export class FileUploaderComponent {
  // Inputs
  accept = input<string>('.pdf,.doc,.docx,.txt');
  maxSizeMB = input<number>(10);
  label = input<string>('Arrastra y suelta tu archivo aquí');
  hint = input<string>('');
  disabled = input<boolean>(false);
  existingFileName = input<string | undefined>(undefined);
  existingFileUrl = input<string | undefined>(undefined);

  // Outputs
  fileSelected = output<File>();
  fileRemoved = output<void>();
  error = output<string>();

  // Internal state
  protected readonly isDragging = signal<boolean>(false);
  protected readonly selectedFile = signal<UploadedFile | null>(null);
  protected readonly errorMessage = signal<string>('');

  // Computed
  protected readonly hasFile = computed(() =>
    this.selectedFile() !== null || this.existingFileName() !== undefined
  );

  protected readonly displayFileName = computed(() =>
    this.selectedFile()?.file.name ?? this.existingFileName() ?? ''
  );

  protected readonly displayFileSize = computed(() => {
    const file = this.selectedFile()?.file;
    if (!file) return '';
    return this.formatFileSize(file.size);
  });

  protected readonly acceptedFormats = computed(() => {
    const formats = this.accept().split(',').map(f => f.trim().replace('.', '').toUpperCase());
    return formats.join(', ');
  });

  protected readonly maxSizeText = computed(() => `Máximo ${this.maxSizeMB()} MB`);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled()) {
      this.isDragging.set(true);
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    if (this.disabled()) return;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  openFileDialog(): void {
    if (!this.disabled()) {
      this.fileInput.nativeElement.click();
    }
  }

  removeFile(): void {
    this.selectedFile.set(null);
    this.errorMessage.set('');
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.fileRemoved.emit();
  }

  private handleFile(file: File): void {
    this.errorMessage.set('');

    // Validar tipo de archivo
    if (!this.isValidFileType(file)) {
      const msg = `Tipo de archivo no permitido. Formatos aceptados: ${this.acceptedFormats()}`;
      this.errorMessage.set(msg);
      this.error.emit(msg);
      return;
    }

    // Validar tamaño
    const maxBytes = this.maxSizeMB() * 1024 * 1024;
    if (file.size > maxBytes) {
      const msg = `El archivo excede el tamaño máximo de ${this.maxSizeMB()} MB`;
      this.errorMessage.set(msg);
      this.error.emit(msg);
      return;
    }

    this.selectedFile.set({ file });
    this.fileSelected.emit(file);
  }

  private isValidFileType(file: File): boolean {
    const acceptedTypes = this.accept().split(',').map(t => t.trim().toLowerCase());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const fileMimeType = file.type.toLowerCase();

    return acceptedTypes.some(accepted => {
      if (accepted.startsWith('.')) {
        return fileExtension === accepted;
      }
      if (accepted.includes('*')) {
        const [type] = accepted.split('/');
        return fileMimeType.startsWith(type + '/');
      }
      return fileMimeType === accepted;
    });
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  protected getFileIcon(): string {
    const fileName = this.displayFileName().toLowerCase();
    if (fileName.endsWith('.pdf')) {
      return 'pdf';
    } else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
      return 'word';
    } else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
      return 'excel';
    } else if (fileName.endsWith('.txt')) {
      return 'text';
    }
    return 'file';
  }
}
