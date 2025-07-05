// Content moderation service for detecting inappropriate content
export interface ModerationResult {
  isAppropriate: boolean;
  reason?: string;
  suggestedChanges?: string[];
}

class ContentModerationService {
  // Insultos comunes
  private insults = [
    'estúpido', 'imbécil', 'idiota', 'tonto', 'burro', 'basura'
  ];

  // Palabras ofensivas fuertes
  private offensiveWords = [
    'mierda', 'puta', 'pendejo', 'maldito', 'carajo', 'jódete',
    'shit', 'fuck', 'bitch', 'damn', 'asshole'
  ];

  // Lenguaje discriminatorio
  private discriminatoryLanguage = [
    'maricón', 'negro de mierda', 'india de mierda', 'indio de mierda', 
    'sidoso', 'retrasado', 'viejo inútil', 'puto', 'gay de mierda',
    'retard', 'faggot', 'nigger'
  ];

  // Patrones de agresión
  private aggressionPatterns = [
    /eres un.{0,20}(estúpido|imbécil|idiota|pendejo|maricón)/gi,
    /ojalá te mueras/gi,
    /te odio/gi,
    /me das asco/gi,
    /no sirves/gi,
    /vete a la mierda/gi,
    /shut up/gi,
    /mother fucker/gi,
    /son of a bitch/gi
  ];

  // URLs y enlaces sospechosos
  private suspiciousUrlPatterns = [
    /(http|https):\/\/[^\s]+/gi,
    /www\.[^\s]+/gi,
    /bit\.ly\/[^\s]+/gi,
    /tinyurl\.com\/[^\s]+/gi,
    /[^\s]+\.(ru|tk|xyz|top)/gi
  ];

  // Palabras de promoción no autorizada
  private promotionalWords = [
    'compra ahora', 'oferta exclusiva', 'click aquí', 'suscríbete',
    'gana dinero fácil', 'trabajo desde casa', 'freegift', 'bonus',
    'prize', 'win money', 'free offer', 'limited time'
  ];

  // Información falsa o engañosa
  private misleadingPhrases = [
    'garantizado 100%', 'esto nunca falla', 'esto es real créanme',
    'esto es real, créanme', 'todos los productos son iguales',
    'el mejor precio del mundo', '100% guaranteed', 'never fails',
    'trust me this is real'
  ];

  // Patrones de spam (caracteres repetitivos, números de teléfono, etc.)
  private spamPatterns = [
    /(.)\1{4,}/g, // Repeated characters (5 or more)
    /[\d\-\(\)\+\s]{10,}/g, // Phone numbers
    /[A-Z]{5,}/g, // Excessive caps
    /!{3,}/g, // Multiple exclamation marks
    /\?{3,}/g // Multiple question marks
  ];

  moderateContent(content: string, rating?: number): ModerationResult {
    const normalizedContent = content.toLowerCase().trim();
    
    // Check for empty content
    if (!normalizedContent || normalizedContent.length < 10) {
      return {
        isAppropriate: false,
        reason: "La reseña debe tener al menos 10 caracteres",
        suggestedChanges: ["Proporciona más detalles sobre tu experiencia con el producto"]
      };
    }

    // Check for any inappropriate content patterns
    const foundInsults = this.insults.filter(word => 
      normalizedContent.includes(word.toLowerCase())
    );

    const foundOffensive = this.offensiveWords.filter(word => 
      normalizedContent.includes(word.toLowerCase())
    );

    const foundDiscriminatory = this.discriminatoryLanguage.filter(phrase => 
      normalizedContent.includes(phrase.toLowerCase())
    );

    const hasAggressionPatterns = this.aggressionPatterns.some(pattern => 
      pattern.test(content)
    );

    const hasSuspiciousUrls = this.suspiciousUrlPatterns.some(pattern => 
      pattern.test(content)
    );

    const foundPromotional = this.promotionalWords.filter(phrase => 
      normalizedContent.includes(phrase.toLowerCase())
    );

    const foundMisleading = this.misleadingPhrases.filter(phrase => 
      normalizedContent.includes(phrase.toLowerCase())
    );

    const hasSpamPatterns = this.spamPatterns.some(pattern => 
      pattern.test(content)
    );

    // If any inappropriate content is found, return the standardized error message
    if (foundInsults.length > 0 || foundOffensive.length > 0 || foundDiscriminatory.length > 0 || 
        hasAggressionPatterns || hasSuspiciousUrls || foundPromotional.length > 0 || 
        foundMisleading.length > 0 || hasSpamPatterns) {
      return {
        isAppropriate: false,
        reason: "Evitar uso de lenguaje o contenido inapropiado",
        suggestedChanges: ["Evitar uso de lenguaje o contenido inapropiado"]
      };
    }

    // Check rating consistency with content
    if (rating && rating <= 2) {
      const positiveWords = ['excelente', 'genial', 'perfecto', 'increíble', 'fantástico', 'amazing', 'excellent', 'perfect'];
      const hasPositiveWords = positiveWords.some(word => 
        normalizedContent.includes(word.toLowerCase())
      );

      if (hasPositiveWords) {
        return {
          isAppropriate: false,
          reason: "La calificación no coincide con el comentario positivo",
          suggestedChanges: [
            "Asegúrate de que tu calificación refleje tu comentario",
            "Si tuviste una mala experiencia, explica los motivos específicos",
            "Si el producto es excelente, considera una calificación más alta"
          ]
        };
      }
    }

    if (rating && rating >= 4) {
      const negativeWords = ['terrible', 'horrible', 'pésimo', 'awful', 'worst', 'hate', 'disgusting'];
      const hasNegativeWords = negativeWords.some(word => 
        normalizedContent.includes(word.toLowerCase())
      );

      if (hasNegativeWords) {
        return {
          isAppropriate: false,
          reason: "La calificación alta no coincide con el comentario negativo",
          suggestedChanges: [
            "Asegúrate de que tu calificación refleje tu comentario",
            "Si el producto es terrible, considera una calificación más baja",
            "Si tienes una buena experiencia, explica los aspectos positivos"
          ]
        };
      }
    }

    return { isAppropriate: true };
  }
}

export const contentModerationService = new ContentModerationService();
