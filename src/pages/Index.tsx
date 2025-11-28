import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface Movie {
  id: number;
  title: string;
  avatar: string;
  price: number;
  isPurchased: boolean;
  isUserUploaded?: boolean;
  videoUrl?: string;
  codes: {
    grayFrame: string;
    halfGray: string;
    blackScreen: string;
    interruption: string;
    permanentInterruption: string;
  };
}

const Index = () => {
  const [coins, setCoins] = useState(10);
  const [clickCount, setClickCount] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPlayingMovie, setIsPlayingMovie] = useState(false);
  const [editedCodes, setEditedCodes] = useState({
    grayFrame: '',
    halfGray: '',
    blackScreen: '',
    interruption: '',
    permanentInterruption: ''
  });
  const [interruptionClicks, setInterruptionClicks] = useState(0);
  const [interruptionTimer, setInterruptionTimer] = useState<number | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadAvatar, setUploadAvatar] = useState('🎥');
  const [uploadPrice, setUploadPrice] = useState(5);
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [movies, setMovies] = useState<Movie[]>([
    {
      id: 1,
      title: 'Космическая Одиссея',
      avatar: '🚀',
      price: 5,
      isPurchased: false,
      codes: {
        grayFrame: '1111211111',
        halfGray: '1111111111',
        blackScreen: '1111111111',
        interruption: '1111111111',
        permanentInterruption: '1111111111'
      }
    },
    {
      id: 2,
      title: 'Тайна Океана',
      avatar: '🌊',
      price: 8,
      isPurchased: false,
      codes: {
        grayFrame: '1111111111',
        halfGray: '1112111111',
        blackScreen: '1111111111',
        interruption: '1111111111',
        permanentInterruption: '1111111111'
      }
    },
    {
      id: 3,
      title: 'Ночной Город',
      avatar: '🌃',
      price: 6,
      isPurchased: false,
      codes: {
        grayFrame: '1111111111',
        halfGray: '1111111111',
        blackScreen: '1111121111',
        interruption: '1111111111',
        permanentInterruption: '1111111111'
      }
    },
    {
      id: 4,
      title: 'Драконья Легенда',
      avatar: '🐉',
      price: 10,
      isPurchased: false,
      codes: {
        grayFrame: '1111111111',
        halfGray: '1111111111',
        blackScreen: '1111111111',
        interruption: '1111211111',
        permanentInterruption: '1111111111'
      }
    }
  ]);

  const handleCoinClick = () => {
    setClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 50) {
        setCoins((c) => c + 1);
        toast({
          title: '🎉 Получено!',
          description: '+1 монета!'
        });
        return 0;
      }
      return newCount;
    });
  };

  const purchaseMovie = (movie: Movie) => {
    if (coins >= movie.price) {
      setCoins(coins - movie.price);
      setMovies(
        movies.map((m) =>
          m.id === movie.id ? { ...m, isPurchased: true } : m
        )
      );
      toast({
        title: '✅ Куплено!',
        description: `Фильм "${movie.title}" теперь ваш!`
      });
    } else {
      toast({
        title: '❌ Недостаточно монет',
        description: `Нужно ещё ${movie.price - coins} монет`,
        variant: 'destructive'
      });
    }
  };

  const openEditor = (movie: Movie) => {
    setSelectedMovie(movie);
    setEditedCodes(movie.codes);
    setIsEditorOpen(true);
  };

  const saveCodes = () => {
    if (selectedMovie) {
      setMovies(
        movies.map((m) =>
          m.id === selectedMovie.id ? { ...m, codes: editedCodes } : m
        )
      );
      toast({
        title: '💾 Сохранено',
        description: 'Коды обновлены'
      });
      setIsEditorOpen(false);
    }
  };

  const playMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsPlayingMovie(true);
    checkMovieIssues(movie);
  };

  const checkMovieIssues = (movie: Movie) => {
    if (movie.codes.grayFrame.includes('2')) {
      toast({
        title: '⚠️ Серый кадр обнаружен!',
        description: 'Исправьте код в редакторе',
        variant: 'destructive'
      });
    }
    if (movie.codes.halfGray.includes('2')) {
      toast({
        title: '⚠️ Половина экрана серая!',
        description: 'Исправьте код в редакторе',
        variant: 'destructive'
      });
    }
    if (movie.codes.blackScreen.includes('2')) {
      toast({
        title: '⚠️ Черный экран!',
        description: 'Исправьте код в редакторе',
        variant: 'destructive'
      });
    }
    if (movie.codes.interruption.includes('2')) {
      startInterruptionChallenge();
    }
  };

  const startInterruptionChallenge = () => {
    setInterruptionClicks(0);
    const timer = window.setTimeout(() => {
      if (interruptionClicks < 15) {
        toast({
          title: '❌ Обрыв!',
          description: 'Не успели кликнуть 15 раз за 5 секунд',
          variant: 'destructive'
        });
      }
      setInterruptionTimer(null);
    }, 5000);
    setInterruptionTimer(timer);
    toast({
      title: '⚡ Обрыв!',
      description: 'Кликните 15 раз за 5 секунд!'
    });
  };

  const handleInterruptionClick = () => {
    if (interruptionTimer) {
      setInterruptionClicks((prev) => {
        const newCount = prev + 1;
        if (newCount >= 15) {
          clearTimeout(interruptionTimer);
          setInterruptionTimer(null);
          toast({
            title: '✅ Успех!',
            description: 'Обрыв устранён!'
          });
        }
        return newCount;
      });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setUploadedVideo(file);
      toast({
        title: '✅ Видео выбрано',
        description: file.name
      });
    } else {
      toast({
        title: '❌ Ошибка',
        description: 'Пожалуйста, выберите видео файл',
        variant: 'destructive'
      });
    }
  };

  const saveUploadedMovie = () => {
    if (!uploadTitle.trim()) {
      toast({
        title: '❌ Ошибка',
        description: 'Введите название фильма',
        variant: 'destructive'
      });
      return;
    }
    if (!uploadedVideo) {
      toast({
        title: '❌ Ошибка',
        description: 'Выберите видео файл',
        variant: 'destructive'
      });
      return;
    }

    const videoUrl = URL.createObjectURL(uploadedVideo);
    const newMovie: Movie = {
      id: Date.now(),
      title: uploadTitle,
      avatar: uploadAvatar,
      price: uploadPrice,
      isPurchased: false,
      isUserUploaded: true,
      videoUrl,
      codes: {
        grayFrame: '1111111111',
        halfGray: '1111111111',
        blackScreen: '1111111111',
        interruption: '1111111111',
        permanentInterruption: '1111111111'
      }
    };

    setMovies([...movies, newMovie]);
    toast({
      title: '🎉 Успех!',
      description: `Фильм "${uploadTitle}" добавлен в магазин!`
    });

    setIsUploadOpen(false);
    setUploadTitle('');
    setUploadAvatar('🎥');
    setUploadPrice(5);
    setUploadedVideo(null);
  };

  const deleteMovie = (movieId: number) => {
    setMovies(movies.filter((m) => m.id !== movieId));
    toast({
      title: '🗑️ Удалено',
      description: 'Фильм удалён'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-900/20 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Кино Мания 🎬
            </h1>
            <p className="text-muted-foreground mt-2">Игровая платформа мини-фильмов</p>
          </div>
          <Card className="border-primary/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <Button
                onClick={handleCoinClick}
                variant="outline"
                size="icon"
                className="h-16 w-16 rounded-full animate-pulse-glow hover:animate-coin-flip border-yellow-500/50"
              >
                <span className="text-3xl">🪙</span>
              </Button>
              <div>
                <p className="text-2xl font-bold text-yellow-500">{coins}</p>
                <p className="text-xs text-muted-foreground">
                  Клики: {clickCount}/50
                </p>
                <Progress value={(clickCount / 50) * 100} className="h-1 mt-1" />
              </div>
            </CardContent>
          </Card>
        </header>

        <Tabs defaultValue="shop" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="shop" className="gap-2">
              <Icon name="Store" size={18} />
              Магазин
            </TabsTrigger>
            <TabsTrigger value="library" className="gap-2">
              <Icon name="Library" size={18} />
              Библиотека
            </TabsTrigger>
            <TabsTrigger value="my-videos" className="gap-2">
              <Icon name="Upload" size={18} />
              Мои видео
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shop" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {movies
                .filter((m) => !m.isPurchased)
                .map((movie, idx) => (
                  <Card
                    key={movie.id}
                    className="border-primary/30 hover:border-primary transition-all duration-300 hover:scale-105 animate-fade-in backdrop-blur-sm bg-card/80"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <span className="text-6xl">{movie.avatar}</span>
                        <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
                          {movie.price} 🪙
                        </Badge>
                      </div>
                      <CardTitle className="text-lg mt-2">{movie.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => purchaseMovie(movie)}
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80"
                      >
                        <Icon name="ShoppingCart" size={16} className="mr-2" />
                        Купить
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="library" className="space-y-4">
            {movies.filter((m) => m.isPurchased).length === 0 ? (
              <Card className="border-dashed border-primary/30 bg-card/50">
                <CardContent className="p-12 text-center">
                  <Icon name="Film" size={64} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Ваша библиотека пуста</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Купите фильмы в магазине
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {movies
                  .filter((m) => m.isPurchased)
                  .map((movie, idx) => (
                    <Card
                      key={movie.id}
                      className="border-primary/30 hover:border-secondary transition-all duration-300 animate-fade-in backdrop-blur-sm bg-card/80"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <span className="text-6xl">{movie.avatar}</span>
                          <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
                            <Icon name="Check" size={14} className="mr-1" />
                            Куплен
                          </Badge>
                        </div>
                        <CardTitle className="text-lg mt-2">{movie.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Button
                          onClick={() => playMovie(movie)}
                          className="w-full bg-gradient-to-r from-accent to-secondary hover:from-accent/80 hover:to-secondary/80"
                        >
                          <Icon name="Play" size={16} className="mr-2" />
                          Смотреть
                        </Button>
                        <Button
                          onClick={() => openEditor(movie)}
                          variant="outline"
                          className="w-full border-primary/50"
                        >
                          <Icon name="Code" size={16} className="mr-2" />
                          Редактор кодов
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-videos" className="space-y-4">
            <Card className="border-primary/30 bg-card/50">
              <CardContent className="p-6">
                <Button
                  onClick={() => setIsUploadOpen(true)}
                  className="w-full bg-gradient-to-r from-accent to-primary hover:from-accent/80 hover:to-primary/80"
                  size="lg"
                >
                  <Icon name="Plus" size={20} className="mr-2" />
                  Загрузить видео
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {movies
                .filter((m) => m.isUserUploaded)
                .map((movie, idx) => (
                  <Card
                    key={movie.id}
                    className="border-primary/30 hover:border-accent transition-all duration-300 animate-fade-in backdrop-blur-sm bg-card/80"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <span className="text-6xl">{movie.avatar}</span>
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                          <Icon name="User" size={14} className="mr-1" />
                          Моё
                        </Badge>
                      </div>
                      <CardTitle className="text-lg mt-2">{movie.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Цена: {movie.price} 🪙</span>
                        <span>{movie.isPurchased ? 'Продано' : 'В продаже'}</span>
                      </div>
                      {movie.videoUrl && (
                        <Button
                          onClick={() => playMovie(movie)}
                          variant="outline"
                          className="w-full border-primary/50"
                        >
                          <Icon name="Play" size={16} className="mr-2" />
                          Просмотр
                        </Button>
                      )}
                      <Button
                        onClick={() => deleteMovie(movie.id)}
                        variant="destructive"
                        className="w-full"
                      >
                        <Icon name="Trash2" size={16} className="mr-2" />
                        Удалить
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
          <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Icon name="Code" size={24} />
                Текстовый редактор кодов
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Исправьте цифры "2" на "1" для устранения проблем
              </p>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Icon name="Image" size={16} />
                  Серый кадр (3 сек случайного момента)
                </label>
                <Textarea
                  value={editedCodes.grayFrame}
                  onChange={(e) =>
                    setEditedCodes({ ...editedCodes, grayFrame: e.target.value })
                  }
                  className="font-mono bg-background border-primary/30"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Icon name="SplitSquareHorizontal" size={16} />
                  Половина экрана серая
                </label>
                <Textarea
                  value={editedCodes.halfGray}
                  onChange={(e) =>
                    setEditedCodes({ ...editedCodes, halfGray: e.target.value })
                  }
                  className="font-mono bg-background border-primary/30"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Icon name="Square" size={16} />
                  Черный экран
                </label>
                <Textarea
                  value={editedCodes.blackScreen}
                  onChange={(e) =>
                    setEditedCodes({ ...editedCodes, blackScreen: e.target.value })
                  }
                  className="font-mono bg-background border-primary/30"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Icon name="Zap" size={16} />
                  Обрыв (15 кликов за 5 сек)
                </label>
                <Textarea
                  value={editedCodes.interruption}
                  onChange={(e) =>
                    setEditedCodes({ ...editedCodes, interruption: e.target.value })
                  }
                  className="font-mono bg-background border-primary/30"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Icon name="Ban" size={16} />
                  Обрыв навсегда
                </label>
                <Textarea
                  value={editedCodes.permanentInterruption}
                  onChange={(e) =>
                    setEditedCodes({
                      ...editedCodes,
                      permanentInterruption: e.target.value
                    })
                  }
                  className="font-mono bg-background border-primary/30"
                  rows={2}
                />
              </div>
              <Button
                onClick={saveCodes}
                className="w-full bg-gradient-to-r from-primary to-accent"
              >
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent className="max-w-xl bg-card/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Icon name="Upload" size={24} />
                Загрузить видео
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Название фильма</label>
                <Input
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Введите название..."
                  className="bg-background border-primary/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Аватарка (эмодзи)</label>
                <Input
                  value={uploadAvatar}
                  onChange={(e) => setUploadAvatar(e.target.value)}
                  placeholder="🎥"
                  className="bg-background border-primary/30"
                  maxLength={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Цена (монеты)</label>
                <Input
                  type="number"
                  value={uploadPrice}
                  onChange={(e) => setUploadPrice(Number(e.target.value))}
                  min={1}
                  className="bg-background border-primary/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Видео файл</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full border-primary/50"
                >
                  <Icon name="Upload" size={16} className="mr-2" />
                  {uploadedVideo ? uploadedVideo.name : 'Выбрать видео'}
                </Button>
              </div>
              <Button
                onClick={saveUploadedMovie}
                className="w-full bg-gradient-to-r from-primary to-accent"
              >
                <Icon name="Save" size={16} className="mr-2" />
                Добавить в магазин
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isPlayingMovie} onOpenChange={setIsPlayingMovie}>
          <DialogContent className="max-w-4xl bg-card/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Icon name="Play" size={24} />
                {selectedMovie?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedMovie?.videoUrl ? (
                <video
                  src={selectedMovie.videoUrl}
                  controls
                  className="w-full aspect-video rounded-lg border border-primary/30"
                />
              ) : (
                <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-lg flex items-center justify-center border border-primary/30">
                  <span className="text-9xl">{selectedMovie?.avatar}</span>
                </div>
              )}
              {interruptionTimer && (
                <Button
                  onClick={handleInterruptionClick}
                  className="w-full bg-red-500 hover:bg-red-600 animate-pulse-glow"
                  size="lg"
                >
                  <Icon name="Zap" size={20} className="mr-2" />
                  КЛИКАЙ! {interruptionClicks}/15
                </Button>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsPlayingMovie(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Закрыть
                </Button>
                <Button
                  onClick={() => selectedMovie && openEditor(selectedMovie)}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary"
                >
                  <Icon name="Code" size={16} className="mr-2" />
                  Редактор
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;