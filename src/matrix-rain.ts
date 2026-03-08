export class MatrixRain {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private streams: Stream[] = [];
  private characterSet: string[] = [];
  private fontSize: number = 16;
  private columns: number = 0;
  private animationId: number | null = null;

  private readonly colors = {
    background: '#001000',
    head: '#ffffff',
    body: '#00ff41',
    bodyDim: '#008f11',
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context');
    }
    this.ctx = ctx;
    this.initCharacterSet();
    this.setupCanvas();
    this.initStreams();
    this.bindEvents();
  }

  private initCharacterSet(): void {
    const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const special = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
    
    const allChars = katakana + latin + digits + special;
    this.characterSet = allChars.split('');
  }

  private setupCanvas(): void {
    this.resizeCanvas();
  }

  private resizeCanvas(): void {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.ctx.scale(dpr, dpr)

    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;

    this.fontSize = Math.max(14, Math.floor(rect.height / 50));
    this.columns = Math.floor(rect.width * 15 / this.fontSize);

    this.ctx.font = `${this.fontSize}px monospace`;
    this.ctx.textBaseline = 'top';

    this.reinitStreams();
  }

  private bindEvents(): void {
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private initStreams(): void {
    this.streams = [];
    for (let i = 0; i < this.columns; i++) {
      this.streams.push(new Stream(i, this));
    }
  }

  private reinitStreams(): void {
    const newStreams: Stream[] = [];
    const minLen = Math.min(this.streams.length, this.columns);

    for (let i = 0; i < minLen; i++) {
      this.streams[i].setColumn(i);
      newStreams.push(this.streams[i]);
    }

    for (let i = minLen; i < this.columns; i++) {
      newStreams.push(new Stream(i, this));
    }

    this.streams = newStreams;
  }

  private clearCanvas(): void {
    this.ctx.fillStyle = this.colors.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private fadeCanvas(): void {
    this.ctx.fillStyle = 'rgba(0, 24, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getRandomChar(): string {
    return this.characterSet[Math.floor(Math.random() * this.characterSet.length)];
  }

  start(): void {
    if (this.animationId !== null) {
      return;
    }
    this.clearCanvas();
    this.animate();
  }

  stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private animate(): void {
    this.fadeCanvas();

    for (const stream of this.streams) {
      stream.update();
      stream.render(this.ctx);
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  getCanvasHeight(): number {
    return this.canvas.getBoundingClientRect().height;
  }

  getFontSize(): number {
    return this.fontSize;
  }

  getHeadColor(): string {
    return this.colors.head;
  }
}

class Stream {
  private columnIndex: number;
  private matrix: MatrixRain;

  private y: number;
  private speed: number = 1;
  private length: number = 10;
  private characters: string[] = [];
  private brightness: number[] = [];
  private resetCounter: number = 0;

  constructor(columnIndex: number, matrix: MatrixRain) {
    this.columnIndex = columnIndex;
    this.matrix = matrix;
    this.randomize();
    this.y = -Math.random() * 500;
  }

  setColumn(index: number): void {
    this.columnIndex = index;
  }

  private randomize(): void {
    this.speed = 0.5 + Math.random() * 5;
    this.length = 5 + Math.floor(Math.random() * 25);
    this.resetCounter = Math.floor(Math.random() * 10);

    this.characters = [];
    this.brightness = [];
    for (let i = 0; i < this.length; i++) {
      this.characters.push(this.matrix.getRandomChar());
      this.brightness.push(0.6 + Math.random() * 0.4);
    }
  }

  update(): void {
    this.y += this.speed;

    if (Math.random() < 0.9) {
      const idx = Math.floor(Math.random() * this.characters.length);
      this.characters[idx] = this.matrix.getRandomChar();
    }

    if (Math.random() < 0.005) {
      const idx = Math.floor(Math.random() * this.brightness.length);
      this.brightness[idx] = 0.6 + Math.random() * 0.4;
    }

    const canvasHeight = this.matrix.getCanvasHeight();
    if (this.y - this.length * this.matrix.getFontSize() > canvasHeight) {
      this.resetCounter++;
      if (this.resetCounter > 10 + Math.random() * 50) {
        this.y = -this.length * this.matrix.getFontSize() * Math.random();
        this.randomize();
        this.resetCounter = 0;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const fontSize = this.matrix.getFontSize();
    const x = this.columnIndex * fontSize;

    for (let i = 0; i < this.length; i++) {
      const charY = this.y - i * fontSize;

      if (charY < -fontSize || charY > this.matrix.getCanvasHeight() + fontSize) {
        continue;
      }

      const isHead = i === 0;
      const brightness = this.brightness[i] || 1;

      if (isHead) {
        ctx.fillStyle = this.matrix.getHeadColor();
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 8;
      } else {
        const fadeFactor = 1 - (i / this.length) * 0.7;
        const r = Math.floor(0 * brightness * fadeFactor);
        const g = Math.floor(255 * brightness * fadeFactor);
        const b = Math.floor(65 * brightness * fadeFactor);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.shadowBlur = 0;
      }

      ctx.fillText(this.characters[i], x, charY);
    }

    ctx.shadowBlur = 0;
  }
}
