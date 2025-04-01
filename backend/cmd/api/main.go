package main

import (
	"context"
	"flag"
	"fmt"
	"log/slog"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/joho/godotenv/autoload"
	"github.com/w4keupvan/gym-ops/backend/internal/database"
	"github.com/w4keupvan/gym-ops/backend/internal/env"
	"github.com/w4keupvan/gym-ops/backend/internal/mailer"
)

type config struct {
	allowedOrigins []string
	baseURL        string
	env            string
	port           int
	dsn            string
	db             struct {
		username string
		password string
		host     string
		port     int
		database string
	}
	jwtTokenKey string
	smtp        struct {
		host     string
		port     int
		username string
		password string
		sender   string
	}
}

type application struct {
	config config
	db     *database.Queries
	logger *slog.Logger
	wg     sync.WaitGroup
	mail   mailer.Mailer
}

func main() {
	var cfg config

	cfg.db.username = env.GetString("DB_USERNAME", "postgres")
	cfg.db.password = env.GetString("DB_PASSWORD", "postgres")
	cfg.db.host = env.GetString("DB_HOST", "localhost")
	cfg.db.port = env.GetInt("DB_PORT", 5432)
	cfg.db.database = env.GetString("DB_DATABASE", "postgres")

	cfg.jwtTokenKey = env.GetString("JWT_TOKEN_KEY", "token_secret")

	cfg.smtp.host = env.GetString("SMTP_HOST", "secret")
	cfg.smtp.port = env.GetInt("SMTP_PORT", 25)
	cfg.smtp.username = env.GetString("SMTP_USERNAME", "secret")
	cfg.smtp.password = env.GetString("SMTP_PASSWORD", "secret")
	cfg.smtp.sender = env.GetString("SMTP_SENDER", "secret")

	flag.StringVar(&cfg.baseURL, "base-url", "http://localhost:4000", "Base url of the server")
	flag.StringVar(&cfg.env, "env", "development", "Server environment (production|development)")
	flag.StringVar(&cfg.dsn, "database-dsn", fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=disable", cfg.db.username, cfg.db.password, cfg.db.host, cfg.db.port, cfg.db.database), "Database dsn of server")
	flag.IntVar(&cfg.port, "port", 4000, "Server listening port")
	flag.Func("allowed-origins", "Allowed origins (space seperated)", func(s string) error {
		cfg.allowedOrigins = strings.Fields(s)
		return nil
	})

	flag.Parse()

	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{}))

	logger.Info("starting database connection")

	dbpool, err := initDB(cfg)
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}

	defer dbpool.Close()

	app := &application{
		config: cfg,
		logger: logger,
		db:     database.New(dbpool),
		mail:   mailer.New(cfg.smtp.host, cfg.smtp.port, cfg.smtp.username, cfg.smtp.password, cfg.smtp.sender),
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

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = db.Ping(ctx)
	if err != nil {
		db.Close()
		return nil, err
	}

	return db, nil
}
