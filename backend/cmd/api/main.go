package main

import (
	"context"
	"flag"
	"fmt"
	"log/slog"
	"os"
	"sync"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/joho/godotenv/autoload"
)

type config struct {
	baseURL string
	env     string
	port    int
	dsn     string
	db      struct {
		username     string
		password     string
		host         string
		port         string
		databaseName string
	}
}

type application struct {
	config config
	logger *slog.Logger
	wg     sync.WaitGroup
}

func main() {
	var cfg config

	cfg.db.username = os.Getenv("DB_USERNAME")
	cfg.db.password = os.Getenv("DB_PASSWORD")
	cfg.db.host = os.Getenv("DB_HOST")
	cfg.db.port = os.Getenv("DB_PORT")
	cfg.db.databaseName = os.Getenv("DB_NAME")

	flag.StringVar(&cfg.baseURL, "base-url", "http://localhost:4000", "Base url of the server")
	flag.StringVar(&cfg.env, "env", "development", "Server environment (production|development)")
	flag.StringVar(&cfg.dsn, "database-dsn", fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", cfg.db.username, cfg.db.password, cfg.db.host, cfg.db.port, cfg.db.databaseName), "Database dsn of server")
	flag.IntVar(&cfg.port, "port", 4000, "Server listening port")

	flag.Parse()

	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{}))

	logger.Info("starting database connection")

	_, err := initDB(cfg)
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}

	app := &application{
		config: cfg,
		logger: logger,
	}

	err = app.serveHTTP()
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}
}

func initDB(cfg config) (*pgxpool.Pool, error) {
	db, err := pgxpool.New(context.Background(), cfg.dsn)
	if err != nil {
		return nil, err
	}

	defer db.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = db.Ping(ctx)
	if err != nil {
		db.Close()
		return nil, err
	}

	return db, nil
}
